/* eslint-disable */

import 'leapjs-plugins/main/leap-plugins-0.1.12';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useEvent } from 'react-use';
import * as THREE from 'three';

import { useLeapController } from '../hooks/use-leap-controller';

const baseBoneRotation = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(Math.PI / 2, 0, 0)
);

export const RealtimeBone: React.FC = () => {
  const { leapController } = useLeapController();
  const ref = useRef<HTMLDivElement>();

  const [{ scene, camera, renderer }] = useState(() => {
    const scene = new THREE.Scene();

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0.5, 1);
    scene.add(directionalLight);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(1, 1);
    // renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    const camera = new THREE.PerspectiveCamera(
      45,
      1, // window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.fromArray([0, 100, 500]);
    camera.lookAt(new THREE.Vector3(0, 160, 0));
    scene.add(camera);

    console.log('hands');

    return { scene, camera, renderer };
  });

  const onSizeChange = useCallback(() => {
    if (ref.current) {
      // debugger;
      camera.aspect = ref.current.clientWidth / ref.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(ref.current.clientWidth, ref.current.clientHeight);
      renderer.render(scene, camera);
    }
  }, []);

  useEvent('resize', onSizeChange, ref.current, {
    capture: false,
  });

  useEffect(() => {
    if (leapController) {
      leapController
        .loop(
          { background: true },
          {
            hand: function (hand) {
              hand.fingers.forEach(function (finger) {
                // This is the meat of the example - Positioning `the cylinders on every frame:
                finger.data('boneMeshes').forEach(function (mesh, i) {
                  const bone = finger.bones[i];

                  mesh.position.fromArray(bone.center());

                  mesh.setRotationFromMatrix(
                    new THREE.Matrix4().fromArray(bone.matrix())
                  );

                  mesh.quaternion.multiply(baseBoneRotation);
                });

                finger.data('jointMeshes').forEach(function (mesh, i) {
                  let bone = finger.bones[i];

                  if (bone) {
                    mesh.position.fromArray(bone.prevJoint);
                  } else {
                    // special case for the finger tip joint sphere:
                    bone = finger.bones[i - 1];
                    mesh.position.fromArray(bone.nextJoint);
                  }
                });
              });

              const armMesh = hand.data('armMesh');

              armMesh.position.fromArray(hand.arm.center());

              armMesh.setRotationFromMatrix(
                new THREE.Matrix4().fromArray(hand.arm.matrix())
              );

              armMesh.quaternion.multiply(baseBoneRotation);

              armMesh.scale.x = hand.arm.width / 2;
              armMesh.scale.z = hand.arm.width / 4;

              renderer.render(scene, camera);
            },
          }
        )
        .use('handHold')
        .use('handEntry')
        .on('handFound', function (hand) {
          hand.fingers.forEach(function (finger) {
            const boneMeshes: any[] = [];
            const jointMeshes: any[] = [];

            finger.bones.forEach(function (bone) {
              // create joints

              // CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)
              const boneMesh = new THREE.Mesh(
                new THREE.CylinderGeometry(5, 5, bone.length),
                new THREE.MeshPhongMaterial()
              );

              boneMesh.material.color.setHex(0xffffff);
              scene.add(boneMesh);
              boneMeshes.push(boneMesh);
            });

            for (let i = 0; i < finger.bones.length + 1; i++) {
              const jointMesh = new THREE.Mesh(
                new THREE.SphereGeometry(8),
                new THREE.MeshPhongMaterial()
              );

              jointMesh.material.color.setHex(0x0088ce);
              scene.add(jointMesh);
              jointMeshes.push(jointMesh);
            }

            finger.data('boneMeshes', boneMeshes);
            finger.data('jointMeshes', jointMeshes);
          });

          if (hand.arm) {
            // 2.0.3+ have arm api,
            // CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)
            const armMesh = new THREE.Mesh(
              new THREE.CylinderGeometry(1, 1, hand.arm.length, 64),
              new THREE.MeshPhongMaterial()
            );

            armMesh.material.color.setHex(0xffffff);

            scene.add(armMesh);

            hand.data('armMesh', armMesh);
          }
        })
        .on('handLost', function (hand) {
          hand.fingers.forEach(function (finger) {
            const boneMeshes = finger.data('boneMeshes');
            const jointMeshes = finger.data('jointMeshes');

            boneMeshes.forEach(function (mesh) {
              scene.remove(mesh);
            });

            jointMeshes.forEach(function (mesh) {
              scene.remove(mesh);
            });

            finger.data({
              boneMeshes: null,
            });
          });

          const armMesh = hand.data('armMesh');
          scene.remove(armMesh);
          hand.data('armMesh', null);

          renderer.render(scene, camera);
        })
        .connect();
    }
  }, [leapController]);

  const refCallback = useCallback(
    (el: HTMLDivElement | null) => {
      if (el) {
        ref.current = el;
        ref.current.appendChild(renderer.domElement);
      }
      onSizeChange();
    },
    [renderer, onSizeChange]
  );

  return <div className="w-full h-full relative" ref={refCallback} />;
};
