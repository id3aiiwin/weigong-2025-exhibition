"use client";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HALL_WIDTH, HALL_HEIGHT } from "./ExhibitionHall";

interface PlayerControlsProps {
  enabled: boolean;
  joystickInput: { x: number; y: number };
}

const MOVE_SPEED = 5;
const LOOK_SPEED = 0.002;
const PLAYER_HEIGHT = 1.7;

export default function PlayerControls({
  enabled,
  joystickInput,
}: PlayerControlsProps) {
  const { camera, gl } = useThree();
  const keys = useRef<Set<string>>(new Set());
  const isPointerLocked = useRef(false);
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => keys.current.add(e.code);
    const handleKeyUp = (e: KeyboardEvent) => keys.current.delete(e.code);

    const handleClick = () => {
      if (!isPointerLocked.current) {
        gl.domElement.requestPointerLock();
      }
    };

    const handlePointerLockChange = () => {
      isPointerLocked.current =
        document.pointerLockElement === gl.domElement;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked.current) return;
      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.y -= e.movementX * LOOK_SPEED;
      euler.current.x -= e.movementY * LOOK_SPEED;
      euler.current.x = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, euler.current.x)
      );
      camera.quaternion.setFromEuler(euler.current);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    gl.domElement.addEventListener("click", handleClick);
    document.addEventListener("pointerlockchange", handlePointerLockChange);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      gl.domElement.removeEventListener("click", handleClick);
      document.removeEventListener(
        "pointerlockchange",
        handlePointerLockChange
      );
      document.removeEventListener("mousemove", handleMouseMove);
      if (document.pointerLockElement === gl.domElement) {
        document.exitPointerLock();
      }
    };
  }, [enabled, camera, gl]);

  useFrame((_, delta) => {
    if (!enabled) return;

    const direction = new THREE.Vector3();
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3()
      .crossVectors(forward, new THREE.Vector3(0, 1, 0))
      .normalize();

    // Keyboard
    if (keys.current.has("KeyW") || keys.current.has("ArrowUp"))
      direction.add(forward);
    if (keys.current.has("KeyS") || keys.current.has("ArrowDown"))
      direction.sub(forward);
    if (keys.current.has("KeyA") || keys.current.has("ArrowLeft"))
      direction.sub(right);
    if (keys.current.has("KeyD") || keys.current.has("ArrowRight"))
      direction.add(right);

    // Joystick (mobile)
    if (joystickInput.x !== 0 || joystickInput.y !== 0) {
      direction.add(right.clone().multiplyScalar(joystickInput.x));
      direction.add(forward.clone().multiplyScalar(-joystickInput.y));
    }

    if (direction.length() > 0) {
      direction.normalize();
      const newPos = camera.position
        .clone()
        .add(direction.multiplyScalar(MOVE_SPEED * delta));

      // 簡易碰撞：限制在走廊範圍內
      const halfWidth = HALL_WIDTH / 2 - 0.5;
      newPos.x = Math.max(-halfWidth, Math.min(halfWidth, newPos.x));
      newPos.y = PLAYER_HEIGHT;

      camera.position.copy(newPos);
    }
  });

  return null;
}
