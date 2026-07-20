document.addEventListener('DOMContentLoaded', () => {
    // 1. スマホ用ハンバーガーメニューの開閉制御
    const menuBtn = document.querySelector('.menu-btn');
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
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // ==========================================================================
    // 3. ページ遷移アニメーション (超シンプル版)
    // ==========================================================================
    const overlayElement = document.querySelector('.page-transition-overlay');
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetUrl = this.getAttribute('href');

            if (
                !targetUrl || 
                this.getAttribute('target') === '_blank' || 
                targetUrl.startsWith('#') ||
                targetUrl.startsWith('tel:') ||
                targetUrl.startsWith('mailto:')
            ) {
                return;
            }

            e.preventDefault();
            
            // 画面を隠すアニメーション（is-leaving）を発動
            if (overlayElement) {
                overlayElement.classList.add('is-leaving');
            }

            // 【変更】1000 → 500 に短縮（0.5秒後にページ移動）
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 500);
        });
    });

    // ==========================================================================
    // 4. スクロール時のフェードインアニメーション
    // ==========================================================================
    // 画面内の「.fade-in-up」がついた要素をすべて取得
    const fadeElements = document.querySelectorAll('.fade-in-up');

    // 画面内に入ったかを判定するオブザーバー（監視者）を作成
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 画面内に入ったら 'is-visible' クラスを追加
                entry.target.classList.add('is-visible');
                
                // 一度表示されたら監視を終了する（何度もフワフワさせないため）
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        // 画面の下から10%の地点を通過したら発火させる
        rootMargin: '0px 0px -10% 0px'
    });

    // 取得したすべての要素を監視対象にセット
    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });
});

// ブラウザの戻るボタン対策
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        const overlay = document.querySelector('.page-transition-overlay');
        if (overlay) {
            overlay.classList.remove('is-leaving');
        }
    }
});