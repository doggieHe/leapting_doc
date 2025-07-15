// GitHub仓库信息
const GITHUB_USER = 'doggieHe';
const GITHUB_REPO = 'leapting_doc';
const GITHUB_BRANCH = 'main';

// DOM元素
const menuGroups = document.querySelectorAll('.menu-group');
const contentArea = document.getElementById('content-area');
const resourceContent = document.getElementById('resource-content');
const welcomeMessage = document.querySelector('.welcome-message');
const imageContainer = document.getElementById('image-container');
const videoContainer = document.getElementById('video-container');
const docContainer = document.getElementById('doc-container');
const resourceTitle = document.getElementById('resource-title');
const resourceImage = document.getElementById('resource-image');
const resourceVideo = document.getElementById('resource-video');
const resourceDoc = document.getElementById('resource-doc');
const backBtn = document.getElementById('back-btn');
const loadingIndicator = document.getElementById('loading-indicator');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 为每个菜单组添加点击事件
  menuGroups.forEach(group => {
    const folderName = group.dataset.folder;
    const sidebarItem = group.querySelector('.sidebar-item');
    const submenu = group.querySelector('.submenu');
    
    // 点击菜单组标题展开/折叠子菜单
    sidebarItem.addEventListener('click', () => {
      // 切换子菜单显示状态
      submenu.classList.toggle('hidden');
      
      // 如果子菜单是空的，则加载文件夹内容
      if (submenu.children.length === 0) {
        loadFolderContent(folderName, submenu);
      }
    });
  });
  
  // 返回按钮点击事件
  backBtn.addEventListener('click', () => {
    showWelcomeMessage();
  });
});

// 从GitHub API加载文件夹内容
async function loadFolderContent(folderName, submenuElement) {
  try {
    // 显示加载状态
    submenuElement.innerHTML = `
      <div class="sidebar-item text-gray-500 cursor-not-allowed">
        <i class="fa fa-circle-o-notch fa-spin w-5 text-center"></i>
        <span>加载中...</span>
      </div>
    `;
    
    // 调用GitHub API获取文件夹内容
    const response = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${folderName}?ref=${GITHUB_BRANCH}`);
    
    if (!response.ok) {
      throw new Error(`无法加载文件夹内容: ${response.statusText}`);
    }
    
    const files = await response.json();
    
    // 清空加载状态
    submenuElement.innerHTML = '';
    
    // 添加文件项
    files.forEach(file => {
      if (file.type === 'file') {
        const fileItem = document.createElement('div');
        fileItem.className = 'sidebar-item submenu-item';
        fileItem.innerHTML = `
          <i class="fa ${getFileIcon(file.name)} w-5 text-center"></i>
          <span>${file.name}</span>
        `;
        
        // 添加点击事件
        fileItem.addEventListener('click', () => {
          // 移除其他菜单项的活跃状态
          document.querySelectorAll('.submenu-item').forEach(item => {
            item.classList.remove('menu-active');
          });
          
          // 添加当前菜单项的活跃状态
          fileItem.classList.add('menu-active');
          
          selectFile(folderName, file.name, file.download_url);
        });
        
        submenuElement.appendChild(fileItem);
      }
    });
    
    // 如果文件夹为空
    if (files.length === 0) {
      submenuElement.innerHTML = `
        <div class="sidebar-item text-gray-500 cursor-not-allowed">
          <i class="fa fa-folder-open-o w-5 text-center"></i>
          <span>文件夹为空</span>
        </div>
      `;
    }
  } catch (error) {
    console.error('加载文件夹内容时出错:', error);
    submenuElement.innerHTML = `
      <div class="sidebar-item text-danger cursor-not-allowed">
        <i class="fa fa-exclamation-triangle w-5 text-center"></i>
        <span>加载失败</span>
      </div>
    `;
  }
}

// 选择文件
function selectFile(folderName, fileName, downloadUrl) {
  // 更新标题
  resourceTitle.textContent = fileName;
  
  // 隐藏欢迎信息，显示资源内容和加载指示器
  welcomeMessage.classList.add('hidden');
  resourceContent.classList.remove('hidden');
  imageContainer.classList.add('hidden');
  videoContainer.classList.add('hidden');
  docContainer.classList.add('hidden');
  loadingIndicator.classList.remove('hidden');
  
  // 根据文件类型显示不同的内容
  var hzm = '.' + fileName.toLowerCase().split('.').pop();
  console.log(hzm);
  
  if (['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(hzm)) {
    showImage(fileName, downloadUrl);
  } else if (['.mp4', '.webm', '.ogg'].includes(hzm)) {
    showVideo(fileName, downloadUrl);
  } else if (['.txt', '.md', '.json', '.xlsx', '.css', '.js'].includes(hzm)) {
    showDocument(fileName, downloadUrl);
  } else {
    // 未知文件类型
    loadingIndicator.classList.add('hidden');
    docContainer.classList.remove('hidden');
    resourceDoc.innerHTML = `
      <div class="text-center py-8">
        <div class="w-16 h-16 rounded-full bg-dark-lighter mx-auto flex items-center justify-center mb-4">
          <i class="fa fa-file-o text-2xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-300 mb-2">无法预览此文件类型</h3>
        <p class="text-gray-500">文件类型: ${getFileExtension(fileName)}</p>
      </div>
    `;
  }
}

// 显示图片
async function showImage(fileName, downloadUrl) {
  try {
    // 直接使用GitHub原始URL，避免跨域问题
    const imageUrl = `./img/${fileName}`;
    
    // 创建图片对象以预加载
    const img = new Image();
    img.onload = () => {
      resourceImage.src = imageUrl;
      resourceImage.alt = fileName;
      loadingIndicator.classList.add('hidden');
      imageContainer.classList.remove('hidden');
    };
    img.onerror = () => {
      throw new Error('图片加载失败');
    };
    img.src = imageUrl;
  } catch (error) {
    console.error('显示图片时出错:', error);
    loadingIndicator.classList.add('hidden');
    docContainer.classList.remove('hidden');
    resourceDoc.innerHTML = `
      <div class="text-center py-8">
        <div class="w-16 h-16 rounded-full bg-dark-lighter mx-auto flex items-center justify-center mb-4">
          <i class="fa fa-picture-o text-2xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-300 mb-2">图片加载失败</h3>
        <p class="text-gray-500">${error.message}</p>
      </div>
    `;
  }
}

  // 显示视频
    async function showVideo(fileName) {
    try {
        loadingIndicator.classList.remove('hidden');
        
        // 使用完整的GitHub原始URL格式
        const videoUrl = `./video/${fileName}`;
        
        // 清除之前的视频源
        resourceVideo.src = '';
        resourceVideo.load();
        
        // 设置新的视频源
        resourceVideo.src = videoUrl;
        resourceVideo.load();
        
        // 视频元数据加载后隐藏加载指示器
        resourceVideo.onloadedmetadata = () => {
        loadingIndicator.classList.add('hidden');
        videoContainer.classList.remove('hidden');
        console.log('视频元数据加载成功');
        };
        
        // 监听视频加载错误
        resourceVideo.onerror = (event) => {
        const errorCode = resourceVideo.error.code;
        const errorMessage = getVideoErrorMessage(errorCode);
        throw new Error(`视频加载失败: ${errorMessage}`);
        };
        
        // 监听视频加载进度
        resourceVideo.onprogress = () => {
        console.log('视频加载进度:', (resourceVideo.buffered.length > 0) ? 
                    (resourceVideo.buffered.end(0) / resourceVideo.duration * 100).toFixed(2) + '%' : '0%');
        };
        
        // 监听视频卡顿
        resourceVideo.onstalled = () => {
        console.log('视频加载卡顿');
        };
        
    } catch (error) {
        console.error('显示视频时出错:', error);
        loadingIndicator.classList.add('hidden');
        docContainer.classList.remove('hidden');
        resourceDoc.innerHTML = `
        <div class="text-center py-8">
            <div class="w-16 h-16 rounded-full bg-dark-lighter mx-auto flex items-center justify-center mb-4">
            <i class="fa fa-film text-2xl text-gray-400"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-300 mb-2">视频加载失败</h3>
            <p class="text-gray-500">${error.message}</p>
            <p class="text-sm text-gray-400 mt-2">请检查视频路径是否正确，文件是否存在，以及是否有访问权限。</p>
        </div>
        `;
    }
    }

// 获取视频错误代码对应的错误信息
function getVideoErrorMessage(errorCode) {
  switch (errorCode) {
    case 1: return 'MEDIA_ERR_ABORTED - 视频加载被用户中止';
    case 2: return 'MEDIA_ERR_NETWORK - 网络错误导致视频加载失败';
    case 3: return 'MEDIA_ERR_DECODE - 视频解码错误';
    case 4: return 'MEDIA_ERR_SRC_NOT_SUPPORTED - 视频格式不支持';
    default: return '未知错误';
  }
}

// 显示文档
async function showDocument(fileName, downloadUrl) {
  try {
    const response = await fetch(downloadUrl);
    
    if (!response.ok) {
      throw new Error(`无法加载文档: ${response.statusText}`);
    }
    
    // 根据文件类型处理内容
    const fileExtension = getFileExtension(fileName).toLowerCase();
    
    if (fileExtension === 'md') {
      // Markdown文件
      const content = await response.text();
      // 简单的Markdown转HTML处理
      const htmlContent = marked(content);
      resourceDoc.innerHTML = htmlContent;
    } else if (fileExtension === 'json') {
      // JSON文件
      const jsonContent = await response.json();
      resourceDoc.innerHTML = `
        <pre class="bg-dark text-gray-300 p-4 rounded overflow-x-auto">
          <code>${JSON.stringify(jsonContent, null, 2)}</code>
        </pre>
      `;
    } else {
      // 文本文件
      const content = await response.text();
      resourceDoc.innerHTML = `
        <pre class="bg-dark text-gray-300 p-4 rounded overflow-x-auto">
          <code>${escapeHTML(content)}</code>
        </pre>
      `;
    }
    
    loadingIndicator.classList.add('hidden');
    docContainer.classList.remove('hidden');
  } catch (error) {
    console.error('显示文档时出错:', error);
    loadingIndicator.classList.add('hidden');
    docContainer.classList.remove('hidden');
    resourceDoc.innerHTML = `
      <div class="text-center py-8">
        <div class="w-16 h-16 rounded-full bg-dark-lighter mx-auto flex items-center justify-center mb-4">
          <i class="fa fa-file-text-o text-2xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-300 mb-2">文档加载失败</h3>
        <p class="text-gray-500">${error.message}</p>
      </div>
    `;
  }
}

// 显示欢迎信息
function showWelcomeMessage() {
  resourceContent.classList.add('hidden');
  welcomeMessage.classList.remove('hidden');
  
  // 移除所有菜单项的活跃状态
  document.querySelectorAll('.submenu-item').forEach(item => {
    item.classList.remove('menu-active');
  });
}

// 获取文件图标
function getFileIcon(fileName) {
  const extension = getFileExtension(fileName).toLowerCase();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
      return 'fa-file-image-o';
    case 'mp4':
    case 'webm':
    case 'ogg':
      return 'fa-file-video-o';
    case 'txt':
    case 'md':
      return 'fa-file-text-o';
    case 'json':
      return 'fa-file-code-o';
    case 'html':
    case 'htm':
      return 'fa-file-code-o';
    case 'css':
      return 'fa-file-code-o';
    case 'js':
      return 'fa-file-code-o';
    case 'pdf':
      return 'fa-file-pdf-o';
    case 'doc':
    case 'docx':
      return 'fa-file-word-o';
    case 'xls':
    case 'xlsx':
      return 'fa-file-excel-o';
    case 'ppt':
    case 'pptx':
      return 'fa-file-powerpoint-o';
    default:
      return 'fa-file-o';
  }
}

// 获取文件扩展名
function getFileExtension(fileName) {
  return fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2);
}

// HTML转义
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 简单的Markdown解析器
function marked(text) {
  // 简单实现，仅处理标题和换行
  return text
    .replace(/#\s+(.*$)/gm, '<h1>$1</h1>')
    .replace(/##\s+(.*$)/gm, '<h2>$1</h2>')
    .replace(/###\s+(.*$)/gm, '<h3>$1</h3>')
    .replace(/\n/g, '<br>');
}