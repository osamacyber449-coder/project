// ================== نظام التبديل بين الثيم النهاري والليلي ==================
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        localStorage.setItem('ai_theme', 'dark');
        document.getElementById('lightModeBtn')?.classList.remove('active');
        document.getElementById('darkModeBtn')?.classList.add('active');
    } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        localStorage.setItem('ai_theme', 'light');
        document.getElementById('darkModeBtn')?.classList.remove('active');
        document.getElementById('lightModeBtn')?.classList.add('active');
    }
}
document.getElementById('lightModeBtn')?.addEventListener('click', () => setTheme('light'));
document.getElementById('darkModeBtn')?.addEventListener('click', () => setTheme('dark'));
if (localStorage.getItem('ai_theme') === 'dark') setTheme('dark');

// ================== نظام إدارة التبويبات (Tabs) ==================
const tab1Btn = document.getElementById('tab1Btn');
const tab2Btn = document.getElementById('tab2Btn');
const tab1Content = document.getElementById('tab1Content');
const tab2Content = document.getElementById('tab2Content');

tab1Btn?.addEventListener('click', () => {
    tab1Btn.classList.add('active');
    tab2Btn.classList.remove('active');
    tab1Content.style.display = 'block';
    tab2Content.style.display = 'none';
});

tab2Btn?.addEventListener('click', () => {
    tab2Btn.classList.add('active');
    tab1Btn.classList.remove('active');
    tab2Content.style.display = 'block';
    tab2Content.style.display = 'none';
});

// ================== دالة التطهير الصارمة لمنع ثغرات XSS ==================
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\//g, '&#x2F;');
}

// ================== التحقق من سلامة وصحة روابط الميديا (ملفات الـ Base64 الآمنة) ==================
function isSafeSrc(src) {
    if (!src) return false;
    // السماح فقط بصيغ الـ Data URI للصور والفيديوهات المرفوعة محلياً لمنع حقن روابط خارجية خبيثة
    return src.startsWith('data:image/') || src.startsWith('data:video/');
}

// الفحص الأمني لحجم الملفات (الحد الأقصى 5 ميجابايت لمنع التسبب بـ Local DoS / Crash للمتصفح)
function isFileSizeSafe(file) {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    return file.size <= MAX_SIZE;
}

// ================== قاعدة البيانات المعرفية الهيكلية ==================
let knowledgeData = {
    attackTypes: { name: "تصنيف أنواع الهجمات AI", items: [
        { name: "هجمات التسميم (Poisoning)", description: "حقن بيانات ضارة في مجموعة التدريب", image: null },
        { name: "هجمات الاستدلال (Inference)", description: "استخراج معلومات حساسة من النموذج", image: null },
        { name: "هجمات الانتحال (Evasion)", description: "تعديل المدخلات لخداع النموذج", image: null }
    ]},
    dangerLevels: { name: "نوع الخطر", items: [
        { name: "حرج جداً", description: "يهدد سلامة النظام بالكامل", image: null },
        { name: "مرتفع", description: "يسبب أضرار كبيرة", image: null },
        { name: "متوسط", description: "تأثير محدود", image: null },
        { name: "منخفض", description: "تأثير بسيط", image: null }
    ]},
    causeImpact: { name: "أسباب تأثير الخطر", text: "1. ضعف البيانات التدريبية\n2. ثغرات في النموذج\n3. هجمات الخصوم المتطورة\n4. تسرب البيانات الحساسة", image: null },
    preventionMethods: { name: "الوقاية من الخطر", text: "1. استخدام بيانات موثوقة ومعتمدة\n2. التحقق المستمر من النماذج\n3. تشفير البيانات الحساسة\n4. جدران الحماية الذكية", image: null },
    requirements: { name: "متطلبات الوقاية من الخطر", text: "• تحديث النماذج دورياً\n• مراقبة السلوك في الوقت الفعلي\n• تصفية المدخلات بدقة\n• استخدام أنظمة AI دفاعية\n• تدريب الفريق على الأمن السيبراني", image: null },
    impactSize: { name: "تصنيف حجم الآثار حسب نوع الخطر", items: [
        { name: "حرج", description: "تعطيل كامل للنظام", image: null },
        { name: "مرتفع", description: "خسائر مالية وتشغيلية كبيرة", image: null },
        { name: "متوسط", description: "تأثير محدود مع إمكانية التعافي", image: null },
        { name: "منخفض", description: "إزعاج بسيط دون خسائر", image: null }
    ]},
    riskDegree: { name: "قياس درجة الخطر", items: [
        { name: "9-10", description: "حرج - تدخل فوري مطلوب", image: null },
        { name: "7-8", description: "عالي - يحتاج إلى خطة علاج", image: null },
        { name: "4-6", description: "متوسط - مراقبة مستمرة", image: null },
        { name: "1-3", description: "منخفض - متابعة روتينية", image: null }
    ]}
};

function saveKnowledge() { 
    try {
        localStorage.setItem("ai_knowledge_complete", JSON.stringify(knowledgeData)); 
    } catch (e) {
        alert("خطأ: تم تجاوز سعة التخزين الآمنة للمتصفح!");
    }
}

function loadKnowledge() {
    try {
        const stored = localStorage.getItem("ai_knowledge_complete");
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed === 'object') knowledgeData = parsed;
        } else {
            saveKnowledge();
        }
    } catch (e) {
        console.error("خطأ أمني أثناء قراءة البيانات المخزنة.");
    }
}

function showFullImage(imgSrc) {
    if (!isSafeSrc(imgSrc)) return; // حظر الصور غير الآمنة
    const viewer = document.createElement('div');
    viewer.className = 'image-viewer';
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = "صورة مكبرة آمنة";
    viewer.appendChild(img);
    viewer.onclick = () => viewer.remove();
    document.body.appendChild(viewer);
}

function renderTabs() {
    const tab1Grid = document.getElementById('tab1Grid');
    if (tab1Grid) {
        tab1Grid.innerHTML = `
            <div class="option-card" data-type="attackTypes"><div class="option-title">🔍 1. تصنيف أنواع الهجمات AI</div><div class="option-preview">${knowledgeData.attackTypes.items.length} نوع</div></div>
            <div class="option-card" data-type="dangerLevels"><div class="option-title">⚠️ 2. نوع الخطر</div><div class="option-preview">${knowledgeData.dangerLevels.items.length} مستوى</div></div>
            <div class="option-card" data-type="causeImpact"><div class="option-title">📖 3. أسباب تأثير الخطر</div><div class="option-preview">نص توضيحي</div></div>
            <div class="option-card" data-type="preventionMethods"><div class="option-title">🛡️ 4. الوقاية من الخطر</div><div class="option-preview">إجراءات وقائية</div></div>
        `;
    }
    const tab2Grid = document.getElementById('tab2Grid');
    if (tab2Grid) {
        tab2Grid.innerHTML = `
            <div class="option-card" data-type="requirements"><div class="option-title">📋 1. متطلبات الوقاية من الخطر</div><div class="option-preview">شرح مفصل</div></div>
            <div class="option-card" data-type="impactSize"><div class="option-title">📊 2. تصنيف حجم الآثار حسب نوع الخطر</div><div class="option-preview">${knowledgeData.impactSize.items.length} تصنيف</div></div>
            <div class="option-card" data-type="riskDegree"><div class="option-title">🎯 3. قياس درجة الخطر</div><div class="option-preview">${knowledgeData.riskDegree.items.length} درجة</div></div>
        `;
    }
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', (e) => { 
            e.stopPropagation(); 
            const type = card.getAttribute('data-type');
            if(type) showDetailsModal(type); 
        });
    });
}

function showDetailsModal(type) {
    const data = knowledgeData[type];
    if (!data) return;
    
    let content = '<div>';
    if (data.items) {
        data.items.forEach((item, idx) => {
            const safeImg = isSafeSrc(item.image) ? `<img src="${item.image}" class="detail-image" onclick="event.stopPropagation(); showFullImage('${item.image}')">` : '<small style="display:block; margin-top:5px; color:#888;">لا توجد صورة مخصصة</small>';
            content += `
                <div class="item-card" data-idx="${idx}">
                    <strong>${escapeHtml(item.name)}</strong>
                    <p>${escapeHtml(item.description)}</p>
                    ${safeImg}
                </div>
            `;
        });
    } else {
        content += `<div class="detail-text">${escapeHtml(data.text).replace(/\n/g,'<br>')}</div>`;
        if (isSafeSrc(data.image)) content += `<img src="${data.image}" class="detail-image" onclick="event.stopPropagation(); showFullImage('${data.image}')">`;
    }
    content += '</div>';

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>📌 ${escapeHtml(data.name)}</h3>
            <div id="modalBody">${content}</div>
            <div class="edit-section">
                <h4 style="color:var(--accent-1); margin-bottom:10px;">✏️ لوحة إدارة وتحديث البيانات الفورية</h4>
                <div id="editArea"></div>
                <button id="saveEditBtn">💾 حفظ التعديلات</button>
                <button id="addImageBtn" class="btn-outline">🖼 رفع صورة</button>
                <button id="deleteImageBtn" class="delete-img-btn">🗑️ حذف الصورة الحالية</button>
                ${data.items ? '<button id="addItemBtn" class="btn-outline">➕ إضافة عنصر جديد</button>' : ''}
            </div>
            <button class="close-modal" style="margin-top:15px; background:#777;">إغلاق</button>
        </div>
    `;
    document.body.appendChild(modal);

    const editArea = modal.querySelector('#editArea');
    if (data.items) {
        let html = '<label>تعديل نصوص العناصر الحالية:</label>';
        data.items.forEach((item, i) => {
            html += `<div style="margin:10px 0; border-bottom:1px solid var(--input-border); padding-bottom:10px;">
                <input type="text" id="itemName_${i}" value="${escapeHtml(item.name)}" placeholder="الاسم">
                <textarea id="itemDesc_${i}" rows="2" placeholder="الوصف">${escapeHtml(item.description)}</textarea>
                <button class="delete-item-btn" data-idx="${i}">🗑️ حذف هذا العنصر</button>
            </div>`;
        });
        editArea.innerHTML = html;
        editArea.querySelectorAll('.delete-item-btn').forEach(btn => {
            btn.onclick = () => {
                const idx = parseInt(btn.getAttribute('data-idx'), 10);
                data.items.splice(idx, 1);
                saveKnowledge(); renderTabs(); modal.remove();
                alert('✅ تم حذف العنصر بنجاح');
            };
        });
    } else {
        editArea.innerHTML = `<textarea id="textEdit" rows="6">${escapeHtml(data.text)}</textarea>`;
    }

    modal.querySelector('#saveEditBtn').onclick = () => {
        if (data.items) {
            data.items.forEach((item, i) => {
                const nameInp = modal.querySelector(`#itemName_${i}`);
                const descInp = modal.querySelector(`#itemDesc_${i}`);
                if(nameInp && descInp) {
                    item.name = nameInp.value;
                    item.description = descInp.value;
                }
            });
        } else {
            const txtEd = modal.querySelector('#textEdit');
            if(txtEd) data.text = txtEd.value;
        }
        saveKnowledge(); renderTabs(); modal.remove();
        alert('✅ تم حفظ التعديلات بنجاح');
    };

    modal.querySelector('#addImageBtn').onclick = () => {
        const input = document.createElement('input');
        input.type = 'file'; input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                if (!isFileSizeSafe(file)) return alert('خطأ أمني: حجم الملف كبير جداً (الأقصى 5 ميجابايت)');
                const reader = new FileReader();
                reader.onload = (ev) => {
                    if (data.items) {
                        const firstItem = data.items[0];
                        if (firstItem) firstItem.image = ev.target.result;
                        else alert('يرجى إضافة عنصر أولاً لربط الصورة به');
                    } else {
                        data.image = ev.target.result;
                    }
                    saveKnowledge(); renderTabs(); modal.remove();
                    alert('✅ تم إضافة الصورة');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    modal.querySelector('#deleteImageBtn').onclick = () => {
        if (confirm('هل تريد بالتأكيد إزالة الصورة الحالية؟')) {
            if (data.items) data.items.forEach(i => i.image = null);
            else data.image = null;
            saveKnowledge(); renderTabs(); modal.remove();
            alert('✅ تم إزالة الصورة بنجاح');
        }
    };

    const addItemBtn = modal.querySelector('#addItemBtn');
    if (addItemBtn) {
        addItemBtn.onclick = () => {
            const newItem = { name: "عنصر جديد مضاف", description: "اضف الوصف والشرح هنا", image: null };
            data.items.push(newItem);
            saveKnowledge(); renderTabs(); modal.remove();
            alert('✅ تم إضافة عنصر بنجاح، يمكنك الآن تعديله');
        };
    }

    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

// ================== نظام رفع الملفات وإدارة الوسائط المباشر ==================
let mediaItems = { images: [], texts: [], videos: [], mixed: [] };

function saveMedia() { 
    try {
        localStorage.setItem("ai_media_complete", JSON.stringify(mediaItems)); 
    } catch(e) {
        alert("خطأ: مساحة التخزين ممتلئة!");
    }
}

function loadMedia() {
    try {
        const stored = localStorage.getItem("ai_media_complete");
        if (stored) {
            const parsed = JSON.parse(stored);
            if(parsed && typeof parsed === 'object') mediaItems = parsed;
        } else {
            saveMedia();
        }
    } catch(e) {
        console.error("خطأ في قراءة وسائط التخزين.");
    }
}

function renderMedia() {
    const container = document.getElementById('mediaLibrary');
    if (!container) return;
    let html = '';
    
    mediaItems.images.forEach((img, idx) => {
        if(isSafeSrc(img)) {
            html += `<div class="media-card"><img src="${img}" onclick="showFullImage('${img}')"><button class="delete-btn" data-type="images" data-idx="${idx}">🗑️ حذف</button></div>`;
        }
    });
    mediaItems.texts.forEach((txt, idx) => {
        html += `<div class="media-card"><div style="background:rgba(0,0,0,0.1); padding:10px; border-radius:12px; font-size:12px; text-align:right;">📄 ${escapeHtml(txt.substring(0,80))}${txt.length>80?'...':''}</div><button class="delete-btn" data-type="texts" data-idx="${idx}">🗑️ حذف</button></div>`;
    });
    mediaItems.videos.forEach((vid, idx) => {
        if(isSafeSrc(vid)) {
            html += `<div class="media-card"><video src="${vid}" controls style="max-width:100%; max-height:100px;"></video><button class="delete-btn" data-type="videos" data-idx="${idx}">🗑️ حذف</button></div>`;
        }
    });
    mediaItems.mixed.forEach((mix, idx) => {
        if(isSafeSrc(mix.image)) {
            html += `<div class="media-card"><img src="${mix.image}" onclick="showFullImage('${mix.image}')"><div style="margin-top:5px; font-size:11px;">✏️ ${escapeHtml(mix.text)}</div><button class="delete-btn" data-type="mixed" data-idx="${idx}">🗑️ حذف</button></div>`;
        }
    });

    container.innerHTML = html || '<p style="grid-column: 1/-1; color: var(--text-secondary); text-align: center;">المكتبة فارغة حالياً، قم برفع بعض الملفات.</p>';

    container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = () => {
            const type = btn.getAttribute('data-type');
            const idx = parseInt(btn.getAttribute('data-idx'), 10);
            if (confirm('هل أنت متأكد من حذف هذا الملف نهائياً؟')) {
                if(mediaItems[type]) {
                    mediaItems[type].splice(idx, 1);
                    saveMedia(); renderMedia();
                }
            }
        };
    });
}

document.getElementById('uploadImageBtn')?.addEventListener('click', () => {
    const fileInput = document.getElementById('fileImage');
    const file = fileInput?.files[0];
    if (!file) return alert('الرجاء اختيار ملف صورة أولاً');
    if (!isFileSizeSafe(file)) return alert('خطأ: حجم الملف يتجاوز الـ 5 ميجابايت');
    const reader = new FileReader();
    reader.onload = (e) => {
        mediaItems.images.push(e.target.result);
        saveMedia(); renderMedia(); fileInput.value = '';
    };
    reader.readAsDataURL(file);
});

document.getElementById('uploadTextBtn')?.addEventListener('click', () => {
    const fileInput = document.getElementById('fileText');
    const file = fileInput?.files[0];
    if (!file) return alert('الرجاء اختيار ملف نصي أولاً');
    if (!isFileSizeSafe(file)) return alert('خطأ: حجم الملف يتجاوز الـ 5 ميجابايت');
    const reader = new FileReader();
    reader.onload = (e) => {
        mediaItems.texts.push(e.target.result);
        saveMedia(); renderMedia(); fileInput.value = '';
    };
    reader.readAsText(file);
});

document.getElementById('uploadVideoBtn')?.addEventListener('click', () => {
    const fileInput = document.getElementById('fileVideo');
    const file = fileInput?.files[0];
    if (!file) return alert('الرجاء اختيار ملف فيديو أولاً');
    if (!isFileSizeSafe(file)) return alert('خطأ: حجم الملف يتجاوز الـ 5 ميجابايت');
    const reader = new FileReader();
    reader.onload = (e) => {
        mediaItems.videos.push(e.target.result);
        saveMedia(); renderMedia(); fileInput.value = '';
    };
    reader.readAsDataURL(file);
});

document.getElementById('uploadMixedBtn')?.addEventListener('click', () => {
    const fileInput = document.getElementById('mixedImage');
    const textInput = document.getElementById('mixedTextContent');
    const file = fileInput?.files[0];
    if (!file || !textInput?.value.trim()) return alert('الرجاء اختيار صورة وكتابة نص معاً');
    if (!isFileSizeSafe(file)) return alert('خطأ: حجم الملف يتجاوز الـ 5 ميجابايت');
    const reader = new FileReader();
    reader.onload = (e) => {
        mediaItems.mixed.push({ image: e.target.result, text: textInput.value });
        saveMedia(); renderMedia(); fileInput.value = ''; textInput.value = '';
    };
    reader.readAsDataURL(file);
});

window.addEventListener('DOMContentLoaded', () => {
    loadKnowledge();
    loadMedia();
    renderTabs();
    renderMedia();
});