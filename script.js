// script.js
// 模拟从服务器获取的文件列表
const fileStructure = {
    "img": [
        {name: "自然风光", file: "hlq_001.jpeg"},
        {name: "城市建筑", file: "city.jpg"},
        {name: "科技元素", file: "tech.jpg"},
        {name: "动物世界", file: "animals.jpg"},
        {name: "星空摄影", file: "stars.jpg"}
    ],
    "video": [
        {name: "项目介绍", file: "intro.mp4"},
        {name: "使用教程", file: "tutorial.mp4"},
        {name: "演示视频", file: "demo.mp4"}
    ],
    "doc": [
        {name: "使用指南", file: "guide.pdf"},
        {name: "项目报告", file: "report.pdf"},
        {name: "API文档", file: "api.pdf"}
    ]
};

// 初始化菜单
document.addEventListener('DOMContentLoaded', function() {
    // 初始化文件菜单
    initFileMenu();
    
    // 文件夹展开/折叠功能
    document.querySelectorAll('.folder-header').forEach(header => {
        header.addEventListener('click', function() {
            const folder = this.parentElement;
            folder.classList.toggle('active');
        });
    });
});

// 初始化文件菜单
function initFileMenu() {
    // 图片资源
    const imgFilesContainer = document.getElementById('img-files');
    fileStructure.img.forEach(item => {
        imgFilesContainer.appendChild(createMenuItem(item, 'image'));
    });
    
    // 视频资源
    const videoFilesContainer = document.getElementById('video-files');
    fileStructure.video.forEach(item => {
        videoFilesContainer.appendChild(createMenuItem(item, 'video'));
    });
    
    // 文档资源
    const docFilesContainer = document.getElementById('doc-files');
    fileStructure.doc.forEach(item => {
        docFilesContainer.appendChild(createMenuItem(item, 'doc'));
    });
    
    // 默认激活第一个图片菜单项
    const firstImgItem = imgFilesContainer.querySelector('.folder-item');
    if (firstImgItem) {
        firstImgItem.classList.add('active');
        firstImgItem.click();
    }
}

// 创建菜单项
function createMenuItem(item, type) {
    const itemElement = document.createElement('div');
    itemElement.className = 'folder-item';
    itemElement.dataset.type = type;
    itemElement.dataset.file = item.file;
    
    let iconClass = 'far fa-file';
    if (type === 'image') iconClass = 'far fa-image';
    if (type === 'video') iconClass = 'fas fa-film';
    if (type === 'doc') iconClass = 'far fa-file-pdf';
    
    itemElement.innerHTML = `
        <i class="${iconClass}"></i>
        <span>${item.name}</span>
    `;
    
    // 添加点击事件
    itemElement.addEventListener('click', function() {
        // 更新活动状态
        document.querySelectorAll('.folder-item').forEach(el => {
            el.classList.remove('active');
        });
        this.classList.add('active');
        
        // 获取文件信息
        const fileType = this.dataset.type;
        const fileName = this.dataset.file;
        const itemName = this.querySelector('span').textContent;
        
        // 更新内容区域标题
        document.getElementById('content-title').textContent = itemName;
        
        // 隐藏所有卡片和空状态
        document.getElementById('empty-content').style.display = 'none';
        document.querySelectorAll('.file-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // 显示对应的预览卡片
        switch(fileType) {
            case 'image':
                document.getElementById('image-title').textContent = itemName;
                document.getElementById('image-previewer').src = `img/${fileName}`;
                document.getElementById('image-previewer').alt = itemName;
                document.getElementById('image-preview').classList.add('active');
                break;
            case 'video':
                document.getElementById('video-title').textContent = itemName;
                const videoPlayer = document.getElementById('video-player');
                videoPlayer.querySelector('source').src = `video/${fileName}`;
                videoPlayer.load();
                document.getElementById('video-preview').classList.add('active');
                break;
            case 'doc':
                document.getElementById('doc-title').textContent = itemName;
                document.getElementById('doc-download').href = `doc/${fileName}`;
                document.getElementById('doc-preview').classList.add('active');
                break;
        }
    });
    
    return itemElement;
}