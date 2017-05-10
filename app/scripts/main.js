(() => {

    window.addEventListener('load', () => {

        const MINUTES_LEN = 60;
        const ANGLE = 360 / MINUTES_LEN;
        const MIN_RADIUS = 0; //最小半径
        const MAX_RADIUS = 1.5; //最大半径
        const STRAT_Y = -3;
        const END_Y = 0.5;


        // 汎用変数の宣言
        let width = window.innerWidth; // ブラウザのクライアント領域の幅
        let height = window.innerHeight; // ブラウザのクライアント領域の高さ
        let targetDOM = document.getElementById('webgl'); // スクリーンとして使う DOM

        // three.js 定義されているオブジェクトに関連した変数を宣言
        let scene; // シーン
        let camera; // カメラ
        let renderer; // レンダラ
        let axis; //ガイド
        let grid; //ガイド
        let directional;
        let ambient;
        let clockMesheGroup; //時計のメモリ用メッシュグループ
        let clockMesheGroupChild;
        let sphereInstance = [];
        let oldTime; //過去の時間を設定

        // 各種パラメータを設定するために定数オブジェクトを定義
        let CAMERA_PARAMETER = { // カメラに関するパラメータ
            fovy: 90,
            aspect: width / height,
            near: 0.1,
            far: 100.0,
            x: 0.0, // + 右 , - 左
            y: 1.5, // + 上, - 下
            z: 2.0, // + 手前, - 奥
            lookAt: new THREE.Vector3(0.0, 0.0, 0.0) //x,y,z
        };
        let RENDERER_PARAMETER = { // レンダラに関するパラメータ
            clearColor: 0xffffff, //背景のリセットに使う色
            width: width,
            height: height
        };

        //イントロアニメーション用
        let introAnimationParam = {
            maxRadius: Math.PI / 180 * (360 * 3),
            isCompAnimePos: false,
            isCompAnimeRotation: false,
        };

        //let GROUND_MATERIAL = { color: 0xffffff, side: THREE.DoubleSide };

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
            CAMERA_PARAMETER.fovy,
            CAMERA_PARAMETER.aspect,
            CAMERA_PARAMETER.near,
            CAMERA_PARAMETER.far
        );

        camera.position.x = CAMERA_PARAMETER.x;
        camera.position.y = CAMERA_PARAMETER.y;
        camera.position.z = CAMERA_PARAMETER.z;
        camera.lookAt(CAMERA_PARAMETER.lookAt); //注視点（どこをみてるの？）

        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(RENDERER_PARAMETER.clearColor));
        renderer.setSize(RENDERER_PARAMETER.width, RENDERER_PARAMETER.height);
        //renderer.shadowMap.enabled = true; //影を有効
        targetDOM.appendChild(renderer.domElement); //canvasを挿入する

        controls = new THREE.OrbitControls(camera, render.domElement);

        //時計の部品を作成
        clockMesheGroup = new THREE.Group();

        for (var i = 0; i < MINUTES_LEN; i++) {
            let sphere = new ClockMeshGroup(i);
            sphereInstance[i] = sphere;
            clockMesheGroup.add(sphere.create());
        }

        clockMesheGroupChild = clockMesheGroup.children;

        //時計の部品シーンに追加
        scene.add(clockMesheGroup);

        //ライト
        directional = new THREE.DirectionalLight(0xffffff);
        ambient = new THREE.AmbientLight(0xffffff, 0.25);

        //directional.castShadow = true;
        directional.shadow.mapSize.width = 800;
        directional.shadow.mapSize.height = 800;
        scene.add(directional);
        scene.add(ambient);

        // axis = new THREE.AxisHelper(1000);
        // axis.position.set(0, 0, 0);
        // scene.add(axis);

        // // グリッドのインスタンス化
        // grid = new THREE.GridHelper(100, 50);

        // グリッドオブジェクトをシーンに追加する
        //scene.add(grid);

        render();

        //描画
        function render() {
            let currentTime = getTime(); //現在時刻
            let currentHour = currentTime.h % 12 * 5;
            if (oldTime === void(0)) {
                sphereInstance[currentTime.m].startMinuteAnimation();
                sphereInstance[currentHour].startHourAnimation();
            }

            //画面表示時のアニメーション
            if (!introAnimationParam.isCompAnimePos || !introAnimationParam.isCompAnimeRotation) {
                introAnimation();
            } else {

                //秒を更新時に実行
                if (oldTime.s !== currentTime.s) {
                    sphereInstance[currentTime.s].startSecondAnimation();
                }

                //分を更新時に実行
                if (oldTime.m !== currentTime.m) {
                    sphereInstance[currentTime.m].startMinuteAnimation();
                    sphereInstance[oldTime.m].stopMinuteAnimation();
                }

                //時を更新時に実行
                if (oldTime.h !== currentTime.h) {
                    sphereInstance[currentHour].startHourAnimation();
                    sphereInstance[oldTime.h % 12 * 5].stopHourAnimation();
                }

            }

            // rendering
            renderer.render(scene, camera);

            //現在時刻を過去の時刻として設定
            oldTime = currentTime;

            // animation
            requestAnimationFrame(render);
        }


        function introAnimation() {

            //縦方向に移動と、中央から広がるアニメーション
            if (clockMesheGroupChild[59].position.y <= END_Y - 0.01) {
                for (var i = 0; i < 60; i++) {
                    let radian = Math.PI / 180 * ((ANGLE) * i - 90);
                    clockMesheGroupChild[i].position.y += (END_Y - clockMesheGroupChild[i].position.y) / 25;
                    clockMesheGroupChild[i].position.x += (Math.cos(radian) * MAX_RADIUS - clockMesheGroupChild[i].position.x) / 25;
                    clockMesheGroupChild[i].position.z += (Math.sin(radian) * MAX_RADIUS - clockMesheGroupChild[i].position.z) / 25;
                }

            } else {
                let currentRadius = 360 - (clockMesheGroup.rotation.y * 180 / Math.PI / 360);

                for (var i = 0; i < 60; i++) {
                    let radian = Math.PI / 180 * ((ANGLE) * i - 90);
                    clockMesheGroupChild[i].position.y = END_Y;
                    clockMesheGroupChild[i].position.x = Math.cos(radian) * MAX_RADIUS;
                    clockMesheGroupChild[i].position.z = Math.sin(radian) * MAX_RADIUS;
                }

                //縦移動のアニメーションが終わったらフラグを変更
                introAnimationParam.isCompAnimePos = true;
            }

            if (clockMesheGroup.rotation.y <= introAnimationParam.maxRadius - 0.0025) {
                clockMesheGroup.rotation.y += (introAnimationParam.maxRadius - clockMesheGroup.rotation.y) / 25;
            } else {
                clockMesheGroup.rotation.y = introAnimationParam.maxRadius;

                //回転のアニメーションが終わったらフラグを変更
                introAnimationParam.isCompAnimeRotation = true;
            }

        }


        //日付を取得
        function getTime() {
            let currentDate = new Date();
            return {
                h: currentDate.getHours(),
                m: currentDate.getMinutes(),
                s: currentDate.getSeconds(),
                ms: currentDate.getMilliseconds()
            }
        }

    }, false);
})();