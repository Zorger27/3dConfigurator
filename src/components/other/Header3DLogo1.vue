<script>
import {onMounted, onUnmounted, ref} from "vue";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default {
  name: 'Header3DLogo1',
  methods: {},
  setup() {
    const canvasContainer = ref(null);
    let scene, camera, renderer, controls;

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 85);

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      canvasContainer.value.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enableZoom = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 2.0;

      // Создаем маленький кубик
      const smallCubeGeometry1 = new THREE.BoxGeometry(0.8, 0.8, 0.8);

      // Определение массива текстурных путей
      const texturePaths = [
        '/assets/img/cube3/cube3-01.webp', '/assets/img/cube3/cube3-02.webp', '/assets/img/cube3/cube3-03.webp',
        '/assets/img/cube3/cube3-04.webp', '/assets/img/cube3/cube3-05.webp', '/assets/img/cube3/cube3-06.webp',
        '/assets/img/cube3/cube3-07.webp', '/assets/img/cube3/cube3-08.webp', '/assets/img/cube3/cube3-09.webp',
        '/assets/img/cube3/cube3-10.webp', '/assets/img/cube3/cube3-11.webp', '/assets/img/cube3/cube3-12.webp',
        '/assets/img/cube3/cube3-13.webp', '/assets/img/cube3/cube3-14.webp', '/assets/img/cube3/cube3-15.webp',
        '/assets/img/cube3/cube3-16.webp', '/assets/img/cube3/cube3-17.webp', '/assets/img/cube3/cube3-18.webp',
        '/assets/img/cube3/cube3-19.webp', '/assets/img/cube3/cube3-20.webp', '/assets/img/cube3/cube3-21.webp',
        '/assets/img/cube3/cube3-22.webp', '/assets/img/cube3/cube3-23.webp', '/assets/img/cube3/cube3-24.webp',
        '/assets/img/cube3/cube3-25.webp', '/assets/img/cube3/cube3-26.webp', '/assets/img/cube3/cube3-27.webp'
      ];

      // Перемешиваем массив текстурных путей
      texturePaths.sort(() => Math.random() - 0.5);

      function createTexturedCube(x, y, z, texturePath) {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(texturePath);

        const material = new THREE.MeshBasicMaterial({ map: texture });
        const cubeClone = new THREE.Mesh(smallCubeGeometry1, material);
        cubeClone.position.set(x, y, z);

        return cubeClone;
      }

      // Создаем главный куб, состоящий из 27 маленьких кубиков
      const mainCube1 = new THREE.Group();

      let textureIndex = 0;

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            let cube;

            // Проверка наличия текстур в массиве
            if (textureIndex < texturePaths.length) {
              cube = createTexturedCube(x, y, z, texturePaths[textureIndex]);
              textureIndex++;
            } else {
              // В случае отсутствия новых текстур, повторно используем те, которые уже использовали
              const repeatedTextureIndex = (textureIndex % texturePaths.length);
              cube = createTexturedCube(x, y, z, texturePaths[repeatedTextureIndex]);
              textureIndex++;
            }

            mainCube1.add(cube);
          }
        }
      }

      scene.add(mainCube1);

      // Устанавливаем углы Эйлера (в радианах) для наклона
      const euler = new THREE.Euler(Math.PI / 2, 0.25, 0);
      mainCube1.setRotationFromEuler(euler);

      // Второй куб
      const mainCube2 = new THREE.Group();
      const smallCubeSize = 0.2;
      // Создаем маленький кубик для mainCube2
      const smallCubeGeometry2 = new THREE.BoxGeometry(smallCubeSize, smallCubeSize, smallCubeSize);

      // Яркие цвета для второго куба
      const brightColors = [
        0xff0000,  // Красный
        0x00ff00,  // Зеленый
        0x0000ff,  // Синий
        0xffff00,  // Желтый
        0xff00ff,  // Пурпурный
        0x00ffff,  // Бирюзовый
        0xff4500,  // Оранжевый
        0x8a2be2,  // Сиреневый
        0x32cd32,  // Ярко-зеленый
        0xffd700,  // Золотой
        0xff69b4,  // Розовый
        0x9400d3,  // Фиолетовый
        0x00fa9a,  // Морская волна
        0xff8c00,  // Темно-оранжевый
        0x8b4513,  // Коричневый
        0x00ced1,  // Темно-бирюзовый
        0xf0e68c,  // Хаки
        0xff6347,  // Темно-красный
        0x87ceeb,  // Светло-голубой
        0x4682b4,  // Синевато-серый
        0x9932cc,  // Темно-фиолетовый
        0x2e8b57,  // Зеленовато-коричневый
        0xff1493,  // Глубокий розовый
        0x7cfc00,  // Лайм
        0xb22222,  // Огненно-красный
        0x20b2aa,  // Синевато-зеленый
        0xff4500   // Красновато-коричневый
      ];

      // Перемешиваем массив brightColors
      const shuffledColors = brightColors.slice().sort(() => Math.random() - 0.5);

      // Массив для отслеживания использованных цветов
      const usedColors = [];

      // Используем перемешанные цвета для создания кубиков
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            let randomColor;

            // Проверка, что остались неиспользованные цвета
            if (usedColors.length < shuffledColors.length) {
              // Получаем цвет из оставшихся неиспользованных
              randomColor = new THREE.Color(shuffledColors[usedColors.length]);
              usedColors.push(shuffledColors[usedColors.length]);
            } else {
              // В случае, если все цвета уже использованы, берем рандомный цвет из массива
              randomColor = new THREE.Color(shuffledColors[Math.floor(Math.random() * shuffledColors.length)]);
            }

            const smallCubeMaterial = new THREE.MeshBasicMaterial({ color: randomColor });
            const cubeClone = new THREE.Mesh(smallCubeGeometry2, smallCubeMaterial);
            cubeClone.position.set(x * smallCubeSize, y * smallCubeSize, z * smallCubeSize);
            mainCube2.add(cubeClone);
          }
        }
      }

      // Параметры орбиты для mainCube2
      const semiMajorAxis2 = 4; // Большая полуось
      const semiMinorAxis2 = 2.7; // Малая полуось
      const orbitSpeed2 = 0.3; // Скорость обращения вокруг mainCube1
      const orbitAngle2 = 0; // Устанавливаем угол начальной орбиты
      const orbitDirection2 = 1; // Направление вращения (1 или -1)

      mainCube2.position.set(semiMajorAxis2 * Math.cos(orbitAngle2), 0, semiMinorAxis2 * Math.sin(orbitAngle2));

      // Создаем материал для линии
      const orbitMaterial2 = new THREE.LineBasicMaterial({ color: 0x00aaff, linewidth: 2 });

      // Создаем геометрию для линии орбиты mainCube2
      const orbitGeometry2 = new THREE.BufferGeometry();
      const orbitPoints2 = [];

      // Добавляем точки орбиты для mainCube2
      for (let i = 0; i <= 360; i++) {
        const angle = (i * Math.PI) / 180;
        const x = semiMajorAxis2 * Math.cos(angle);
        const y = semiMinorAxis2 * Math.sin(angle);
        const z = 0;
        orbitPoints2.push(x, y, z);
      }

      orbitGeometry2.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints2, 3));

      // Создаем объект Line для орбиты mainCube2
      const orbitLine2 = new THREE.Line(orbitGeometry2, orbitMaterial2);

      // Добавляем линию в сцену
      scene.add(orbitLine2);

      // Функция для обновления позиции mainCube2 и орбиты
      const updateOrbitPosition2 = () => {
        const time = Date.now() * 0.001;
        const angle = orbitDirection2 * time * orbitSpeed2 + orbitAngle2; // Учитываем направление

        const x = semiMajorAxis2 * Math.cos(angle);
        const y = semiMinorAxis2 * Math.sin(angle);
        const z = 0;

        mainCube2.position.set(x, y, z);
      };

      // Анимация движения по орбите mainCube2
      const animateOrbit2 = () => {
        updateOrbitPosition2();
        requestAnimationFrame(animateOrbit2);
      };

      // Добавляем mainCube2 в сцену
      scene.add(mainCube2);

      // Запускаем анимацию орбиты mainCube2
      animateOrbit2();

      // Третий куб
      let mainCube3 = new THREE.Group();

      const textureLoader = new THREE.TextureLoader();
      // Загрузка текстур
      const textureRight = textureLoader.load('/assets/img/cube2/right.webp');
      const textureLeft = textureLoader.load('/assets/img/cube2/left.webp');
      const textureFront = textureLoader.load('/assets/img/cube2/front.webp');
      const textureBack = textureLoader.load('/assets/img/cube2/back.webp');
      const textureBottom = textureLoader.load('/assets/img/cube2/bottom.webp');
      const textureTop = textureLoader.load('/assets/img/cube2/top.webp');

      const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const materials = [
        new THREE.MeshBasicMaterial({ map: textureRight }),
        new THREE.MeshBasicMaterial({ map: textureLeft }),
        new THREE.MeshBasicMaterial({ map: textureTop }),
        new THREE.MeshBasicMaterial({ map: textureBottom }),
        new THREE.MeshBasicMaterial({ map: textureFront }),
        new THREE.MeshBasicMaterial({ map: textureBack }),
      ];

      mainCube3 = new THREE.Mesh(geometry, materials);

      // Параметры орбиты для mainCube3
      const semiMajorAxis3 = 5.3; // Большая полуось
      const semiMinorAxis3 = 4; // Малая полуось
      const orbitSpeed3 = 0.3;
      const orbitAngle3 = 0; // Устанавливаем угол начальной орбиты
      const orbitDirection3 = -1; // Направление вращения (1 или -1)

      mainCube3.position.set(semiMajorAxis3 * Math.cos(orbitAngle3), 0, semiMinorAxis3 * Math.sin(orbitAngle3));

      // Создаем материал для линии
      const orbitMaterial3 = new THREE.LineBasicMaterial({ color: 0x8a2be2, linewidth: 2 });

      // Создаем геометрию для линии орбиты mainCube3
      const orbitGeometry3 = new THREE.BufferGeometry();
      const orbitPoints3 = [];

      // Добавляем точки орбиты для mainCube3
      for (let i = 0; i <= 360; i++) {
        const angle = (i * Math.PI) / 180;
        const x = semiMajorAxis3 * Math.cos(angle);
        const y = 0;
        const z = semiMinorAxis3 * Math.sin(angle);
        orbitPoints3.push(x, y, z);
      }

      orbitGeometry3.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints3, 3));

      // Создаем объект Line для орбиты mainCube3
      const orbitLine3 = new THREE.Line(orbitGeometry3, orbitMaterial3);

      // Добавляем линию орбиты в сцену
      scene.add(orbitLine3);

      // Функция для обновления позиции mainCube3 и орбиты
      const updateOrbitPosition3 = () => {
        const time = Date.now() * 0.001;
        const angle = orbitDirection3 * time * orbitSpeed3 + orbitAngle3; // Учитываем направление
        const x = semiMajorAxis3 * Math.cos(angle);
        const y = 0;
        const z = semiMinorAxis3 * Math.sin(angle);

        mainCube3.position.set(x, y, z);
      };

      // Анимация движения по орбите mainCube3
      const animateOrbit3 = () => {
        updateOrbitPosition3();
        orbitLine3.rotation.y = mainCube3.rotation.y; // Синхронизация поворота линии орбиты
        requestAnimationFrame(animateOrbit3);
      };

      // Добавляем mainCube3 в сцену
      scene.add(mainCube3);

      // Запускаем анимацию орбиты mainCube3
      animateOrbit3();

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      // Объект-группа для всей сцены
      const sceneGroup = new THREE.Group();
      scene.add(sceneGroup);

      // Все объекты вместо scene прямо в sceneGroup
      sceneGroup.add(mainCube1);
      sceneGroup.add(mainCube2);
      sceneGroup.add(orbitLine2)
      sceneGroup.add(mainCube3);
      sceneGroup.add(orbitLine3)

      // Вращение всей группы сцены
      const sceneRotationAngle = 10; // Угол в градусах
      sceneGroup.rotation.x = THREE.MathUtils.degToRad(sceneRotationAngle);

      animate(); // Начинаем анимацию сразу после определения функции
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', onWindowResize);

    onMounted(() => {
      init();
      onWindowResize();
    });

    onUnmounted(() => {
      renderer.dispose();
    });

    return {
      canvasContainer
    };
  },
}
</script>

<template>
  <div class="scene-container" ref="canvasContainer"></div>
</template>

<style lang="scss" scoped>
.scene-container {
  max-height: 100vh;
  max-width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
