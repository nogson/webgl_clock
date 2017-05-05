class ClockMesh {

    constructor(pos, rotation, material, geometry) {

        this.mesh;
        this.material = material;
        this.geometry = geometry;
        this.pos = pos;
        this.rotation = rotation;
        this.raf;
        this.compZoom = false;
        this.compSecondAnimation = true; //秒のアニメーション制御用フラグ
        this.compMinuteAnimation = true; //分のアニメーション制御用フラグ
        this.compHourAnimation = true; //時のアニメーション制御用フラグ
        this.maxScale = 3;
        this.minScale = 0.1;
        this.zoomInterval;
        this.targetPos = Math.random() * 0.5;
        this.minuteAnimationRadian = 0;
        this.rotaionMinRadius = 0.01;
        this.rotaionRadius = this.rotaionMinRadius;
        this.rotaionMaxRadius = 0.15;
        this.isOldHour = false;
    }

    create() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
        this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
        this.minScale = Math.random() * this.maxScale;
        this.maxScale = this.minScale + this.maxScale;
        this.mesh.scale.set(this.minScale, this.minScale, this.minScale);
        this.mesh.castShadow = true;
        this.render();
        return this.mesh;
    }

    render() {
        //通常のアニメーション
        this.normalAnimation();

        //秒のアニメーション
        this.secondAnimation();

        //分のアニメーション
        this.minuteAnimation();

        //時のアニメーション
        this.hourAnimation();

        this.raf = requestAnimationFrame(this.render.bind(this));
    }

    normalAnimation() {
        this.mesh.rotation.x += 0.005;
        this.mesh.rotation.y += 0.005;
        this.mesh.rotation.z += 0.005;
    }

    //秒用のアニメーション
    secondAnimation() {

        if (this.compSecondAnimation === true || this.compHourAnimation === false) {
            return false;
        }

        let scale;

        if (this.mesh.scale.x >= this.maxScale - 0.01) {
            this.compZoom = true;
        }

        if (this.compZoom === false) {
            //拡大
            scale = (this.maxScale - this.mesh.scale.x) / this.zoomInterval;
        } else {
            //縮小
            scale = (this.minScale - this.mesh.scale.x) / this.zoomInterval * 2;
        }

        if (this.mesh.scale.x < this.minScale - 0.01 && this.compZoom === true) {
            this.mesh.scale.set(this.minScale, this.minScale, this.minScale);
            this.compSecondAnimation = true;
        } else {
            this.mesh.scale.x += scale;
            this.mesh.scale.y += scale;
            this.mesh.scale.z += scale;
        }
    }

    //分用のアニメーション
    minuteAnimation() {

        if (this.compMinuteAnimation === true) {
            if (this.rotaionRadius > this.rotaionMinRadius) {
                this.rotaionRadius -= 0.0005;
            }
            this.minuteAnimationRadian += Math.random() * 0.05;
            this.mesh.position.y = this.pos.y + Math.cos(this.minuteAnimationRadian) * this.rotaionRadius;
            this.mesh.position.z = this.pos.z + Math.sin(this.minuteAnimationRadian) * this.rotaionRadius;
        } else {
            if (this.rotaionRadius < this.rotaionMaxRadius) {
                this.rotaionRadius += 0.0005;
            }
            this.minuteAnimationRadian += Math.random() * 0.05;
            this.mesh.position.y = this.pos.y + Math.cos(this.minuteAnimationRadian) * this.rotaionRadius;
            this.mesh.position.z = this.pos.z + Math.sin(this.minuteAnimationRadian) * this.rotaionRadius;
        }
    }


    hourAnimation() {
        if (this.compHourAnimation === true) {
            this.mesh.position.x += (this.pos.x - this.mesh.position.x) / 10;
            this.mesh.position.y += (this.pos.x - this.mesh.position.y) / 10;
            this.mesh.position.z += (this.pos.x - this.mesh.position.z) / 10;
        } else {
            this.mesh.position.set(0, 0, 0);
            this.mesh.scale.set(this.maxScale * 2.5, this.maxScale * 2.5, this.maxScale * 2.5);
        }

        if (this.isOldHour === true) {
            let scale = (this.minScale - this.mesh.scale.x) / this.zoomInterval * 2;
            this.mesh.scale.x += scale;
            this.mesh.scale.y += scale;
            this.mesh.scale.z += scale;
            if (this.mesh.scale.x < this.minScale - 0.01) {
                this.mesh.scale.set(this.minScale, this.minScale, this.minScale);
                this.isOldHour = false;
            }
        }
    }

    startSecondAnimation() {
        this.compSecondAnimation = false;
        this.compZoom = false;
        this.zoomInterval = Math.random() * 150 + 25;
        this.render();
    }

    startMinuteAnimation() {
        this.compMinuteAnimation = false;
    }

    stopMinuteAnimation() {
        this.compMinuteAnimation = true;
    }

    startHourAnimation() {
        this.compHourAnimation = false;
    }

    stopHourAnimation() {
        this.oldHour = true;
    }








}