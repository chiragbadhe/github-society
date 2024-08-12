import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import * as THREE from "three";
import { fetchGitHubContributions } from "@/lib/github";
import { ContributionsProps, Week } from "@/types";
import { getContributionColor } from "@/utils";
import { OrbitControls, STLExporter } from "three/examples/jsm/Addons.js";

const Contributions3D = forwardRef<any, ContributionsProps>(
  ({ username, token, height, width, modelDepth = 1 }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const sceneInitialized = useRef(false);
    const [isAnimating, setIsAnimating] = useState(true);
    const [gui, setGui] = useState<any | null>(null);
    const buildingsGroupRef = useRef<THREE.Group | null>(null);

    useImperativeHandle(ref, () => ({
      exportModel: () => {
        if (buildingsGroupRef.current) {
          const exporter = new STLExporter();
          const result = exporter.parse(buildingsGroupRef.current);
          const blob = new Blob([result], { type: "model/stl" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "model.stl";
          link.click();
        }
      },
    }));

    useEffect(() => {
      if (typeof window === "undefined") return; // Prevent SSR issues

      const fetchAndRender = async () => {
        try {
          const data = await fetchGitHubContributions(username, token);
          if (
            !data.user ||
            !data.user.contributionsCollection ||
            !data.user.contributionsCollection.contributionCalendar
          ) {
            throw new Error("Invalid username or token");
          }

          const weeks =
            data.user.contributionsCollection.contributionCalendar.weeks;

          if (!sceneInitialized.current) {
            render3DView(weeks);
            sceneInitialized.current = true;
          }
        } catch (error) {
          throw new Error("Failed to fetch contributions"); // Throw error to be caught by the parent
        }
      };

      const render3DView = async (weeks: Week[]) => {
        if (!containerRef.current) return;

        // Dynamically import dat.gui
        const { GUI } = await import("dat.gui");

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          30,
          width! / height!,
          0.8,
          1500
        );
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(width!, height!);
        renderer.setClearColor(0x000000, 0); // Set clear color with alpha = 0 for transparency
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xc1c1c1);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(8, 10, 8);
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 1, 50);
        pointLight.position.set(25, 25, 25);
        scene.add(pointLight);

        const spotLight = new THREE.SpotLight(0xffffff, 0.3);
        spotLight.position.set(-10, 10, -10);
        spotLight.angle = Math.PI / 4;
        spotLight.penumbra = 0.1;
        spotLight.distance = 100;
        spotLight.decay = 2;
        scene.add(spotLight);

        // Create buildings group with base
        const buildingsGroup = new THREE.Group();

        // Create base
        const baseHeight = 1;
        const totalWidth = 53 * (1 + 0.5) - 0.5; // Adjusted to fit 52 weeks + some margin
        const totalDepth = 7 * (1 + 0.5) - 0.5; // 7 days per week
        const baseGeometry = new THREE.BoxGeometry(
          totalWidth,
          baseHeight,
          totalDepth
        );
        const baseMaterial = new THREE.MeshStandardMaterial({
          color: 0x424242,
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(0, baseHeight / 2, 0);
        buildingsGroup.add(base);

        // Create buildings in calendar format
        const buildingWidth = 1;
        const buildingDepth = 1;
        const maxHeight = 20;

        weeks.forEach((week, weekIndex) => {
          week.contributionDays.forEach((day, dayIndex) => {
            const height = Math.min(day.contributionCount, maxHeight);
            const geometry = new THREE.BoxGeometry(
              buildingWidth,
              height,
              buildingDepth
            );
            const color = new THREE.Color(
              getContributionColor(day.contributionCount)
            );
            const material = new THREE.MeshStandardMaterial({ color });
            const building = new THREE.Mesh(geometry, material);
            building.position.set(
              (weekIndex - 26) * (buildingWidth + 0.5), // Adjust position for calendar alignment
              height / 2 + baseHeight,
              (dayIndex - 3) * (buildingDepth + 0.5) // Position buildings to fit a week grid
            );

            buildingsGroup.add(building);
          });
        });

        // Apply depth scaling
        buildingsGroup.scale.z = modelDepth;
        scene.add(buildingsGroup);
        buildingsGroupRef.current = buildingsGroup; // Store the buildings group ref

        // Set camera position
        camera.position.set(0, 20, 60);
        camera.lookAt(0, baseHeight / 2, 0);

        // Add OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
        controls.minPolarAngle = Math.PI / 6;
        controls.maxPolarAngle = Math.PI / 2;
        controls.maxDistance = 100;
        controls.minDistance = 10;
        controlsRef.current = controls;

        // Initialize dat.GUI
        const guiInstance = new GUI();
        guiInstance.domElement.classList.add("datgui-container"); // Add custom class
        setGui(guiInstance);
        const cameraFolder = guiInstance.addFolder("Camera");
        cameraFolder.add(camera.position, "x", -100, 100).name("Camera X");
        cameraFolder.add(camera.position, "y", 0, 100).name("Camera Y");
        cameraFolder.add(camera.position, "z", -100, 100).name("Camera Z");
        cameraFolder.open();
        containerRef.current.appendChild(guiInstance.domElement); // Append to the canvas container

        // Render loop
        const animate = () => {
          requestAnimationFrame(animate);
          if (isAnimating) {
            buildingsGroup.rotation.y += 0.004; // Rotate the model
          }
          controls.update();
          renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
          if (rendererRef.current) {
            rendererRef.current.dispose();
          }
          if (controlsRef.current) {
            controlsRef.current.dispose();
          }
          scene.remove(...scene.children);
          containerRef.current?.removeChild(renderer.domElement);
          if (gui) gui.destroy(); // Cleanup dat.GUI
        };
      };

      fetchAndRender();
    }, [username, token, modelDepth, width, height, isAnimating, gui]);

    return (
      <div
        ref={containerRef}
        className="relative canvas-container bg-[rgb(13,13,13)] border rounded-2xl border-white/10"
        style={{ width: width, height: height }}
      />
    );
  }
);

Contributions3D.displayName = "Contributions3D";

export default Contributions3D;
