const cursor = document.querySelector('.cursor');

document.addEventListener("mousemove", (e) => {
    requestAnimationFrame(() => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    cursor.classList.add('cursor-move');
    setTimeout(() => {
        cursor.classList.remove('cursor-move');
    }, 500);
});

cursor.classList.add('cursor-click');
setTimeout(() => {
    cursor.classList.remove('cursor-click');
}, 500);