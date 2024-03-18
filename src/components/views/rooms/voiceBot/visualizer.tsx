import { useEffect, useRef } from "react";
import * as THREE from "three";

import { Spinner } from "./spinner";
// import { useTheme } from '@/context/ThemeContext'
class CustomSinusoidalCurve extends THREE.Curve<THREE.Vector3> {
    length: number;
    radius: number;
    pi2: number;

    constructor(length: number, radius: number) {
        super();
        this.length = length;
        this.radius = radius;
        this.pi2 = Math.PI * 2;
    }

    getPoint(t: number): THREE.Vector3 {
        const x = this.length * Math.sin(this.pi2 * t);
        const y = this.radius * Math.cos(this.pi2 * 3 * t);
        let z: number;
        let temp: number;

        temp = (t % 0.25) / 0.25;
        temp = (t % 0.25) - (2 * (1 - temp) * temp * -0.0185 + temp * temp * 0.25);
        if (Math.floor(t / 0.25) === 0 || Math.floor(t / 0.25) === 2) {
            temp *= -1;
        }
        z = this.radius * Math.sin(this.pi2 * 2 * (t - temp));

        return new THREE.Vector3(x, y, z);
    }
}

export const Visualizer = ({ status }: { status: string }) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const spinnerRef = useRef<HTMLDivElement>(null);
    const incrementSpeed = useRef(1);
    const decrementSpeed = useRef(2);
    const rotateValue = useRef(0.035);
    const meshRef = useRef<THREE.Mesh>();
    //   const ringRef = useRef<THREE.Mesh>()
    const ringCoverRef = useRef<THREE.Mesh>();
    const groupRef = useRef<THREE.Group>();
    const sceneRef = useRef<THREE.Scene>();
    const cameraRef = useRef<THREE.PerspectiveCamera>();
    const rendererRef = useRef<THREE.WebGLRenderer>();
    // Set up basic variables
    const toEnd = useRef(false);
    const animateStep = useRef(0);
    const acceleration = useRef(0);
    const length = 30;
    const radius = 5.6;

    useEffect(() => {
        if (!wrapRef.current) return;

        // Set up the scene, camera, and renderer
        sceneRef.current = new THREE.Scene();
        cameraRef.current = new THREE.PerspectiveCamera(65, 1, 1, 10000);
        cameraRef.current.position.z = 70;
        rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
        rendererRef.current.setPixelRatio(window.devicePixelRatio);
        rendererRef.current.setSize(500, 500);
        rendererRef.current.setClearColor("#ffffff");

        // Add the renderer to the DOM
        wrapRef.current.appendChild(rendererRef.current.domElement);

        // Create and add objects to the scene
        groupRef.current = new THREE.Group();
        sceneRef.current.add(groupRef.current);

        const customCurve = new CustomSinusoidalCurve(length, radius);
        const geometry = new THREE.TubeGeometry(customCurve, 200, 1.1, 2, true);

        meshRef.current = new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({
                color: 0x82868e,
            }),
        );
        groupRef.current.add(meshRef.current);

        // ... Other object creations like ring and ringcover ...

        ringCoverRef.current = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 15, 1),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                opacity: 0,
                transparent: true,
            }),
        );
        ringCoverRef.current.position.x = length + 1;
        ringCoverRef.current.rotation.y = Math.PI / 2;
        groupRef.current.add(ringCoverRef.current);

        // fake shadow
        (function () {
            let plain;
            let i;
            for (i = 0; i < 10; i++) {
                plain = new THREE.Mesh(
                    new THREE.PlaneGeometry(length * 2 + 1, radius * 3, 1),
                    new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0.13,
                    }),
                );
                plain.position.z = -2.5 + i * 0.5;
                groupRef.current.add(plain);
            }
        })();

        // Start the animation
        animate();

        // Resize listener
        window.addEventListener("resize", resizeRendererToDisplaySize);
        resizeRendererToDisplaySize();

        // Cleanup function
        return () => {
            window.removeEventListener("resize", resizeRendererToDisplaySize);
            //   Dispose of Three.js objects and scene
            groupRef.current && sceneRef.current?.remove(groupRef.current);
            meshRef.current?.geometry.dispose();
            meshRef.current?.material instanceof THREE.Material && meshRef.current?.material.dispose();
            ringCoverRef.current?.geometry.dispose();
            ringCoverRef.current?.material instanceof THREE.Material && ringCoverRef.current?.material.dispose();
            rendererRef.current?.dispose();
        };
    }, []);

    const resizeRendererToDisplaySize = () => {
        if (!rendererRef.current || !wrapRef.current || !cameraRef.current) return;
        const canvas = rendererRef.current.domElement;
        const width = wrapRef.current.clientWidth;
        const height = wrapRef.current.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            rendererRef.current.setSize(width, height, true);
            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
        }
    };

    function easing(t: number, b: number, c: number, d: number) {
        if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
        return (c / 2) * ((t -= 2) * t * t + 2) + b;
    }

    function render() {
        if (
            groupRef.current &&
            cameraRef.current &&
            meshRef.current &&
            ringCoverRef.current &&
            spinnerRef.current &&
            rendererRef.current &&
            sceneRef.current
        ) {
            let progress;

            animateStep.current = Math.max(
                0,
                Math.min(
                    240,
                    toEnd.current
                        ? animateStep.current + incrementSpeed.current
                        : animateStep.current - decrementSpeed.current,
                ),
            );
            acceleration.current = easing(animateStep.current, 0, 1, 240);

            if (acceleration.current > 0.35) {
                progress = (acceleration.current - 0.35) / 0.65;
                groupRef.current.rotation.y = (-Math.PI / 2) * progress;
                groupRef.current.position.z = 50 * progress;
                cameraRef.current.position.z = 70 + 50 * progress;
                progress = Math.max(0, (acceleration.current - 0.97) / 0.03);
                if (meshRef.current.material instanceof THREE.Material) meshRef.current.material.opacity = 1 - progress;
                if (ringCoverRef.current.material instanceof THREE.Material)
                    ringCoverRef.current.material.opacity = progress;
                spinnerRef.current.style.opacity = String(progress);
                spinnerRef.current.style.transform = `scale(${0.8 + 0.2 * progress}) translate(-50%, -50%)`;
            } else {
                cameraRef.current.position.z = 70;
            }

            rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
    }

    // Render loop
    const animate = () => {
        status !== "inactive" && requestAnimationFrame(animate);

        if (meshRef.current) meshRef.current.rotation.x += rotateValue.current + acceleration.current;
        render();
        rendererRef.current &&
            sceneRef.current &&
            cameraRef.current &&
            rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    useEffect(() => {
        if (groupRef.current && cameraRef.current) {
            if (status === "loading") {
                // Directly set animateStep to its final value
                animateStep.current = 240;
                // Apply final transformation
                groupRef.current.rotation.y = -Math.PI / 2; // Final rotation
                groupRef.current.position.z = 50; // Final position
                // Set the final camera position
                cameraRef.current.position.z = 100; // Assuming this is the final position
                if (ringCoverRef.current?.material instanceof THREE.Material) ringCoverRef.current.material.opacity = 1; // Assuming this is the final opacity
                // Set toEnd to true to indicate the end of the animation
                toEnd.current = true;
            } else if (status === "inactive") {
                incrementSpeed.current = 4;
                decrementSpeed.current = 4;
                toEnd.current = true;
            } else if (status === "listen") {
                // slow waves
                decrementSpeed.current = 4;
                rotateValue.current = 0.05;
                toEnd.current = false;
            } else if (status === "compute") {
                // fast waves
                incrementSpeed.current = 0.75;
                decrementSpeed.current = 1;
                toEnd.current = true;
            } else if (status === "speak") {
                // fast spiner
                decrementSpeed.current = 4;
                rotateValue.current = 0.15;
                toEnd.current = false;
            }
        }
    }, [status]);

    return (
        <>
            <div ref={wrapRef} id="wrap" className="z-[1] w-full h-full">
                <div
                    ref={spinnerRef}
                    className="absolute top-1/2 left-1/2"
                    style={{ transform: "translate(-50%, -50%)", opacity: 0 }}
                >
                    <Spinner inactive={status === "inactive"} theme="light" />
                </div>
            </div>
        </>
    );
};
