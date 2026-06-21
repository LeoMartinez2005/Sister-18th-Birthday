const dogs = document.querySelectorAll('.dog');
let followingDogs = []; 
let mouseTimeout;
let mouseX = 0;
let mouseY = 0;
const speed = 5;

dogs.forEach((dog, index) => {
    // Spawn each dog near the right edge of whatever screen is actually
    // visible, instead of a fixed 1800px (which is off-screen on phones).
    const startX = Math.max(0, Math.min(window.innerWidth - 80, window.innerWidth * 0.85));
    const startY = 100 + index * 110;

    dog.style.left = startX + 'px';
    dog.style.top = startY + 'px';
    dog.petX = startX;
    dog.petY = startY;

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

// Touch support so dogs can be led around on phones/tablets too.
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        mouseX = e.touches[0].pageX;
        mouseY = e.touches[0].pageY;
    }
}, { passive: true });

// Keep dogs from getting stranded off-screen if the window is resized
// or the phone is rotated.
window.addEventListener('resize', () => {
    dogs.forEach(dog => {
        const maxX = Math.max(0, window.innerWidth - dog.offsetWidth);
        const maxY = Math.max(0, window.innerHeight - dog.offsetHeight);
        dog.petX = Math.min(dog.petX, maxX);
        dog.petY = Math.min(dog.petY, maxY);
        dog.style.left = dog.petX + 'px';
        dog.style.top = dog.petY + 'px';
    });
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
