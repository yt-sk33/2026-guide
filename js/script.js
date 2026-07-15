document.addEventListener('DOMContentLoaded', () => {
    // 1. スマホ用ハンバーガーメニューの開閉制御
    const menuBtn = document.querySelector('.menu-btn');
    const navPc = document.querySelector('.nav-pc');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
        });
    }

    // 2. ルールページ用アコーディオン（FAQ）の制御
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            const content = this.nextElementSibling;

            // 他のすべてのアコーディオンを閉じる（1つずつ開くスタイルにする場合）
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });

            // クリックされたアコーディオンの切り替え
            item.classList.toggle('active');

            if (item.classList.contains('active')) {
                //scrollHeightで内包する要素の高さを動的に取得して広げる
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    console.log("World Cup Guide: Scripts loaded successfully.");
});