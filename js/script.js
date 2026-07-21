document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. スマホ用ハンバーガーメニューの開閉制御
    // ==========================================================================
    const menuBtn = document.querySelector('.menu-btn');
    const header = document.querySelector('.header');

    if (menuBtn && header) {
        menuBtn.addEventListener('click', () => {
            // ヘッダーに is-open クラスを付け外ししてメニューを開閉
            header.classList.toggle('is-open');
            
            // メニューが開いている時は、裏側の画面がスクロールしないように固定する
            if (header.classList.contains('is-open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // メニュー内のリンクをクリックしたら、自動的にメニューを閉じる
    const navLinks = document.querySelectorAll('.header nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (header && header.classList.contains('is-open')) {
                header.classList.remove('is-open');
                document.body.style.overflow = '';
            }
        });
    });

    // ==========================================================================
    // 2. ルールページ用アコーディオン（FAQ）の制御
    // ==========================================================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            const content = this.nextElementSibling;
            
            // 他の開いているアイテムを閉じる
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });
            
            // クリックしたアイテムの開閉
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // ==========================================================================
    // 3. ページ遷移アニメーション (PC専用・スマホは即遷移)
    // ==========================================================================
    const overlayElement = document.querySelector('.page-transition-overlay');
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetUrl = this.getAttribute('href');

            // アニメーションを除外する条件（外部リンク、ページ内リンク、電話・メールなど）
            if (
                !targetUrl || 
                this.getAttribute('target') === '_blank' || 
                targetUrl.startsWith('#') ||
                targetUrl.startsWith('tel:') ||
                targetUrl.startsWith('mailto:')
            ) {
                return;
            }

            // ▼▼▼ 追加：スマホ版（画面幅768px以下）の場合はアニメーションをスキップして即遷移 ▼▼▼
            if (window.innerWidth <= 768) {
                return; // 処理をここで終了し、デフォルトのリンク遷移に任せる
            }

            e.preventDefault();
            
            // 画面を隠すアニメーション（is-leaving）を発動
            if (overlayElement) {
                overlayElement.classList.add('is-leaving');
            }

            // 0.5秒後にページ移動
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

// 国旗要素に hover 用の国名を自動セット
document.addEventListener('DOMContentLoaded', () => {
    const flagContainers = document.querySelectorAll('.region-circle-item, .featured-flag-item, .team-flag-card, [class*="flag"]');
    flagContainers.forEach(item => {
        const img = item.querySelector('img');
        if (img && img.alt) {
            item.setAttribute('data-name', img.alt);
        }
    });
});

// ==========================================
// 推しの国診断プログラム（全48カ国・10問高精度版）
// ==========================================
let currentQuestionIndex = 0;
let userTags = {}; // ユーザーの回答傾向を蓄積するオブジェクト

// 設問データ（10問に増強）
const quizData = [
    {
        question: "サッカーの試合で一番興奮する瞬間は？",
        choices: [
            { text: "圧倒的な個人技での突破とゴール！", tags: ["attack", "star"] },
            { text: "息を呑むような組織的なパスワーク", tags: ["attack", "teamwork", "tactics"] },
            { text: "絶体絶命のピンチを救う魂のディフェンス", tags: ["defense", "passion"] }
        ]
    },
    {
        question: "チームを引っ張るならどんな選手がいい？",
        choices: [
            { text: "世界中が注目する絶対的スーパースター", tags: ["star", "king"] },
            { text: "経験豊富でチームをまとめるベテラン", tags: ["veteran", "teamwork"] },
            { text: "恐れを知らない若き新星", tags: ["young", "darkhorse", "miracle"] }
        ]
    },
    {
        question: "応援するチームに求めるプレースタイルは？",
        choices: [
            { text: "常にボールを支配し、美しく勝つ", tags: ["attack", "tactics", "king"] },
            { text: "相手の隙を突き、鋭いカウンターを狙う", tags: ["defense", "darkhorse"] },
            { text: "泥臭く最後まで走り抜くハードワーク", tags: ["passion", "teamwork", "miracle"] }
        ]
    },
    {
        question: "大会での立ち位置、どちらに惹かれる？",
        choices: [
            { text: "当然、優勝しか見ていない「絶対王者」", tags: ["king", "star"] },
            { text: "強豪を次々と撃破する「台風の目」", tags: ["darkhorse", "miracle", "young"] },
            { text: "どんな相手にも食らいつく「不屈の挑戦者」", tags: ["passion", "defense", "miracle"] }
        ]
    },
    {
        question: "試合中のメンタリティ、好みなのは？",
        choices: [
            { text: "感情を剥き出しにして熱く闘う", tags: ["passion"] },
            { text: "常に冷静沈着、戦術を遂行する", tags: ["tactics", "teamwork"] },
            { text: "自由な発想と遊び心で観客を魅了する", tags: ["attack", "star"] }
        ]
    },
    {
        question: "試合を観る時、一番注目してしまうポジションは？",
        choices: [
            { text: "ゴールを決めるFW（フォワード）", tags: ["attack", "star"] },
            { text: "ゲームをコントロールするMF（ミッドフィルダー）", tags: ["tactics", "teamwork"] },
            { text: "ゴールを守り抜くDFやGK（ディフェンダー・キーパー）", tags: ["defense", "veteran"] }
        ]
    },
    {
        question: "もしあなたが監督なら、どんな戦術を選ぶ？",
        choices: [
            { text: "前線から激しくプレスをかける超攻撃的戦術", tags: ["passion", "attack", "young"] },
            { text: "相手の良さを消し、確実に1点を守り切る戦術", tags: ["defense", "tactics", "veteran"] },
            { text: "選手個人の才能を最大限に活かす自由な戦術", tags: ["star", "king"] }
        ]
    },
    {
        question: "チームの「歴史と伝統」、どう思う？",
        choices: [
            { text: "歴史あるユニフォームの重みこそ正義", tags: ["king", "veteran"] },
            { text: "過去にとらわれず、新しい歴史を作ってほしい", tags: ["young", "miracle"] },
            { text: "前回大会の悔しさを晴らすリベンジを見たい", tags: ["passion", "darkhorse"] }
        ]
    },
    {
        question: "応援していて一番嬉しい展開は？",
        choices: [
            { text: "格下相手に容赦なく大量得点で圧勝！", tags: ["king", "attack"] },
            { text: "スコアレスドローからの、PK戦での劇的勝利！", tags: ["defense", "miracle"] },
            { text: "先制されてからの、後半ロスタイム大逆転！", tags: ["passion", "darkhorse"] }
        ]
    },
    {
        question: "最後に、あなたにとってワールドカップとは？",
        choices: [
            { text: "スター選手たちが輝く世界最高のエンターテインメント", tags: ["star", "king"] },
            { text: "国と国のプライドがぶつかり合う、総力戦のドラマ", tags: ["teamwork", "passion", "veteran"] },
            { text: "誰も予想できない奇跡と波乱が起きる場所", tags: ["miracle", "darkhorse", "young"] }
        ]
    }
];

// 全48カ国の属性データ
const allCountries = [
    { name: "アルゼンチン", img: "img/argentina.png", tags: ["teamwork", "star", "passion", "king"] },
    { name: "ブラジル", img: "img/brazil.png", tags: ["attack", "star", "passion", "king", "young"] },
    { name: "フランス", img: "img/france.png", tags: ["attack", "star", "young", "king"] },
    { name: "イングランド", img: "img/england.png", tags: ["attack", "young", "tactics", "king"] },
    { name: "スペイン", img: "img/spain.png", tags: ["tactics", "star", "teamwork", "young", "king"] },
    { name: "ドイツ", img: "img/germany.png", tags: ["tactics", "teamwork", "veteran", "king"] },
    { name: "オランダ", img: "img/netherlands.png", tags: ["defence", "veteran", "tactics", "young", "king"] },
    { name: "ポルトガル", img: "img/portugal.png", tags: ["attack", "star", "veteran", "king"] },
    { name: "ベルギー", img: "img/belgium.png", tags: ["attack", "star", "veteran", "king"] },
    { name: "クロアチア", img: "img/croatia.png", tags: ["tactics", "teamwork", "veteran", "darkhorse"] },
    { name: "ウルグアイ", img: "img/uruguay.png", tags: ["defense", "passion", "veteran", "darkhorse"] },
    { name: "コロンビア", img: "img/colombia.png", tags: ["attack", "passion", "star", "darkhorse"] },
    { name: "日本", img: "img/japan.png", tags: ["teamwork", "tactics", "passion", "darkhorse", "miracle"] },
    { name: "モロッコ", img: "img/morocco.png", tags: ["defense", "teamwork", "passion", "miracle"] },
    { name: "セネガル", img: "img/senegal.png", tags: ["attack", "star", "passion", "darkhorse"] },
    { name: "アメリカ合衆国", img: "img/america.png", tags: ["young", "attack", "teamwork", "darkhorse"] },
    { name: "メキシコ", img: "img/mexico.png", tags: ["passion", "veteran", "tactics", "darkhorse"] },
    { name: "韓国", img: "img/south-korea.png", tags: ["attack", "star", "passion", "darkhorse"] },
    { name: "オーストラリア", img: "img/australia.png", tags: ["defense", "teamwork", "passion", "miracle"] },
    { name: "イラン", img: "img/iran.png", tags: ["defense", "tactics", "veteran", "darkhorse"] },
    { name: "サウジアラビア", img: "img/saudiarabia.png", tags: ["tactics", "passion", "miracle", "darkhorse"] },
    { name: "カタール", img: "img/qatar.png", tags: ["attack", "teamwork", "miracle", "darkhorse"] },
    { name: "エクアドル", img: "img/ecuador.png", tags: ["young", "passion", "defense", "darkhorse"] },
    { name: "カナダ", img: "img/canada.png", tags: ["young", "attack", "passion", "miracle"] },
    { name: "スイス", img: "img/switzerland.png", tags: ["tactics", "defense", "veteran", "darkhorse"] },
    { name: "スウェーデン", img: "img/sweden.png", tags: ["defense", "teamwork", "veteran", "darkhorse"] },
    { name: "ノルウェー", img: "img/norway.png", tags: ["attack", "star", "young", "darkhorse"] },
    { name: "スコットランド", img: "img/scotland.png", tags: ["defense", "passion", "teamwork", "miracle"] },
    { name: "チェコ", img: "img/czech.png", tags: ["tactics", "teamwork", "veteran", "miracle"] },
    { name: "オーストリア", img: "img/austria.png", tags: ["tactics", "attack", "teamwork", "darkhorse"] },
    { name: "トルコ", img: "img/turkiye.png", tags: ["passion", "attack", "miracle", "darkhorse"] },
    { name: "ボスニア・ヘルツェゴビナ", img: "img/bosnia.png", tags: ["star", "passion", "veteran", "miracle"] },
    { name: "アルジェリア", img: "img/algeria.png", tags: ["attack", "star", "passion", "darkhorse"] },
    { name: "チュニジア", img: "img/tunisia.png", tags: ["defense", "tactics", "teamwork", "miracle"] },
    { name: "エジプト", img: "img/egypt.png", tags: ["star", "defense", "passion", "miracle"] },
    { name: "ガーナ", img: "img/ghana.png", tags: ["young", "attack", "passion", "miracle"] },
    { name: "コートジボワール", img: "img/cote-dlvoire.png", tags: ["attack", "star", "veteran", "darkhorse"] },
    { name: "南アフリカ", img: "img/south-africa.png", tags: ["passion", "teamwork", "miracle", "darkhorse"] },
    { name: "コンゴ民主共和国", img: "img/congo.png", tags: ["passion", "attack", "miracle", "darkhorse"] },
    { name: "カーボベルデ", img: "img/cape-verde.png", tags: ["teamwork", "tactics", "miracle", "darkhorse"] },
    { name: "パラグアイ", img: "img/paraguay.png", tags: ["defense", "passion", "veteran", "miracle"] },
    { name: "パナマ", img: "img/panama.png", tags: ["passion", "teamwork", "miracle", "darkhorse"] },
    { name: "ハイチ", img: "img/haiti.png", tags: ["passion", "defense", "miracle", "darkhorse"] },
    { name: "キュラソー", img: "img/curacao.png", tags: ["attack", "miracle", "darkhorse"] },
    { name: "イラク", img: "img/iraq.png", tags: ["passion", "defense", "miracle", "darkhorse"] },
    { name: "ヨルダン", img: "img/jordan.png", tags: ["passion", "attack", "miracle", "darkhorse"] },
    { name: "ウズベキスタン", img: "img/uzbekistan.png", tags: ["tactics", "teamwork", "young", "miracle"] },
    { name: "ニュージーランド", img: "img/newzealand.png", tags: ["defense", "teamwork", "miracle", "darkhorse"] }
];

// モーダル操作
function openQuizModal() {
    document.getElementById('quizModal').classList.add('active');
    showStep('quiz-start');
    currentQuestionIndex = 0;
    userTags = {}; // リセット
}
function closeQuizModal() {
    document.getElementById('quizModal').classList.remove('active');
}
function startQuiz() {
    showStep('quiz-question');
    loadQuestion();
}

// 質問を画面にセット
function loadQuestion() {
    const qData = quizData[currentQuestionIndex];
    
    // HTMLの「/ 6」などの表記を自動で全体の質問数（10）に書き換える
    document.querySelector('.quiz-progress').innerHTML = `Q<span id="q-num">${currentQuestionIndex + 1}</span> / ${quizData.length}`;
    
    document.getElementById('q-text').innerText = qData.question;
    
    const choicesContainer = document.getElementById('quiz-choices');
    choicesContainer.innerHTML = ''; 
    
    qData.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'quiz-choice-btn';
        btn.innerText = choice.text;
        btn.onclick = () => selectAnswer(choice.tags);
        choicesContainer.appendChild(btn);
    });
}

// 回答選択時の処理（タグの集計）
function selectAnswer(tags) {
    tags.forEach(tag => {
        userTags[tag] = (userTags[tag] || 0) + 1;
    });
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        calculateAndShowResult();
    }
}

// 48カ国からマッチ度を計算してベスト3を表示
function calculateAndShowResult() {
    // 1. 各国のスコアを計算
    let scoredCountries = allCountries.map(country => {
        let score = 0;
        country.tags.forEach(tag => {
            if(userTags[tag]) score += userTags[tag];
        });
        // 同点時のランダム順位付けのための微小なノイズを追加
        score += Math.random() * 0.1;
        return { ...country, rawScore: score };
    });

    // 2. スコアが高い順に並び替え
    scoredCountries.sort((a, b) => b.rawScore - a.rawScore);

    // 3. 上位3カ国の「マッチ度(%)」をリアルな数字に変換
    let topScore = scoredCountries[0].rawScore;
    
    for (let i = 0; i < 3; i++) {
        let c = scoredCountries[i];
        let ratio = topScore > 0 ? c.rawScore / topScore : 0.5; // エラー防止
        
        let matchRate;
        if (i === 0) {
            matchRate = Math.floor(Math.random() * 5) + 94; // 1位は94〜98%
        } else if (i === 1) {
            matchRate = Math.floor(ratio * 15 + 75); // 2位は75〜90%
        } else {
            matchRate = Math.floor(ratio * 10 + 65); // 3位は65〜75%
        }
        c.matchRate = matchRate;
    }

    // 4. HTMLに結果をセット
    document.getElementById('res1-flag').src = scoredCountries[0].img;
    document.getElementById('res1-name').innerText = scoredCountries[0].name;
    document.getElementById('res1-rate').innerText = scoredCountries[0].matchRate;

    document.getElementById('res2-flag').src = scoredCountries[1].img;
    document.getElementById('res2-name').innerText = scoredCountries[1].name;
    document.getElementById('res2-rate').innerText = scoredCountries[1].matchRate;

    document.getElementById('res3-flag').src = scoredCountries[2].img;
    document.getElementById('res3-name').innerText = scoredCountries[2].name;
    document.getElementById('res3-rate').innerText = scoredCountries[2].matchRate;

    showStep('quiz-result');
}

// 画面切り替え用
function showStep(stepId) {
    document.querySelectorAll('.quiz-step').forEach(step => step.classList.remove('active'));
    document.getElementById(stepId).classList.add('active');
}