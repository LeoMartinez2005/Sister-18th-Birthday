const dogs = document.querySelectorAll('.dog');
let followingDogs = []; 
let mouseTimeout;

let mouseX = 0;
let mouseY = 0;
const speed = 5;

dogs.forEach((dog, index) => {
    dog.style.left = (15 * 120) + 'px';
    dog.style.top = (100 + index * 110) + 'px';

    dog.petX = parseFloat(dog.style.left) || 0;
    dog.petY = parseFloat(dog.style.top) || 0;

    dog.addEventListener('mouseenter', () => {
        if (!followingDogs.includes(dog)) {
            dog.src = dog.getAttribute('data-tail');
        }
    });

    dog.addEventListener('mouseleave', () => {
        if (!followingDogs.includes(dog)) {
            dog.src = dog.getAttribute('data-idle'); 
        }
    });

    dog.addEventListener('click', (e) => {
        e.stopPropagation();

        const dogIndex = followingDogs.indexOf(dog);

        if (dogIndex > -1) {
            dog.src = dog.getAttribute('data-idle');
            followingDogs.splice(dogIndex, 1);
        } else {
            dog.petX = parseFloat(dog.style.left) || 0;
            dog.petY = parseFloat(dog.style.top) || 0;

            followingDogs.push(dog);
            dog.src = dog.getAttribute('data-stand');
        }
    });
});

document.addEventListener('mousemove', (e) => {
    mouseX = e.pageX;
    mouseY = e.pageY;
});

function updatePosition() {
    let areDogsMoving = false;

    followingDogs.forEach((dog, index) => {
        const offsetX = dog.offsetWidth / 2;
        const offsetY = dog.offsetHeight / 2;

        let targetX, targetY;

        if (index === 0) {
            targetX = mouseX - offsetX;
            targetY = mouseY - offsetY;
        } else {
            const leader = followingDogs[index - 1];
            targetX = leader.petX;
            targetY = leader.petY;
        }

        const dx = targetX - dog.petX;
        const dy = targetY - dog.petY;

        const stopDistance = index === 0 ? speed : 50;

        if (Math.hypot(dx, dy) > stopDistance) {
            const angle = Math.atan2(dy, dx);
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed;

            dog.petX += velocityX;
            dog.petY += velocityY;

            dog.style.left = dog.petX + 'px';
            dog.style.top = dog.petY + 'px';

            if (velocityX < 0) {
                dog.style.transform = "scaleX(1)";
            } else {
                dog.style.transform = "scaleX(-1)"; 
            }

            if (!dog.src.includes(dog.getAttribute('data-walk'))) {
                dog.src = dog.getAttribute('data-walk');
            }
            areDogsMoving = true;
        }
    });

    clearTimeout(mouseTimeout);
    if (areDogsMoving) {
        mouseTimeout = setTimeout(() => {
            followingDogs.forEach(dog => {
                dog.src = dog.getAttribute('data-stand');
            });
        }, 150);
    }

    requestAnimationFrame(updatePosition);
}

updatePosition();