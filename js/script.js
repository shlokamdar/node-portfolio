(function(){
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('mobile-open');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav when clicking links
  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('mobile-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // File drag and drop
  const fileDropZone = document.getElementById('fileDropZone');
  const fileInput = document.getElementById('fileInput');
  const fileInfo = document.getElementById('fileInfo');
  const fileName = document.getElementById('fileName');
  const fileSize = document.getElementById('fileSize');
  const removeFile = document.getElementById('removeFile');

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function showFileInfo(file) {
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileInfo.classList.add('show');
  }

  function hideFileInfo() {
    fileInfo.classList.remove('show');
    fileInput.value = '';
  }

  // Click to browse
  fileDropZone.addEventListener('click', () => fileInput.click());

  // Keyboard support
  fileDropZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  // Drag and drop events
  fileDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileDropZone.classList.add('dragover');
  });

  fileDropZone.addEventListener('dragleave', () => {
    fileDropZone.classList.remove('dragover');
  });

  fileDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    fileDropZone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.size > 4 * 1024 * 1024) {
        toast('File size exceeds 4MB limit', false);
        return;
      }
      fileInput.files = files;
      showFileInfo(file);
    }
  });

  // File input change
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 4 * 1024 * 1024) {
        toast('File size exceeds 4MB limit', false);
        fileInput.value = '';
        return;
      }
      showFileInfo(file);
    }
  });

  // Remove file
  removeFile.addEventListener('click', hideFileInfo);

  const form = document.getElementById('contactForm');
  const responseMsg = document.getElementById('responseMsg');
  const progressWrap = document.querySelector('.progress');
  const progressBar = progressWrap && progressWrap.querySelector('div');

  // Updated endpoint for email integration
  const ENDPOINT = "/api/contact";

  function toast(text, success=true){
    const t = document.createElement('div');
    t.className='toast';
    t.textContent = text;
    if(!success) t.style.borderLeft = '4px solid var(--danger)';
    document.body.appendChild(t);
    setTimeout(()=> t.remove(), 4500);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    responseMsg.textContent = '';
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const honeypot = form.website && form.website.value;
    if(honeypot){ toast('Spam detected — dropped.', false); return; }
    if(!name || !email || !message){ responseMsg.textContent = 'Please fill all fields.'; return; }

    // Build multipart form data to allow attachment
    const fd = new FormData();
    fd.append('name', name);
    fd.append('email', email);
    fd.append('message', message);
    if(fileInput.files.length) fd.append('attachment', fileInput.files[0]);

    // UI lock
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    progressWrap.style.display = 'block';
    progressBar.style.width = '0%';

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        body: fd
      });

      const result = await response.json();
      
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
      progressWrap.style.display = 'none';
      progressBar.style.width = '0%';

      if (response.ok) {
        responseMsg.textContent = 'Message sent successfully!';
        toast('Email sent successfully!');
        form.reset();
        hideFileInfo();
      } else {
        responseMsg.textContent = result.message || 'Failed to send message. Try again.';
        toast(result.message || 'Failed to send message', false);
      }
    } catch(err){
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
      progressWrap.style.display = 'none';
      responseMsg.textContent = 'Network error — check console.';
      console.error(err);
      toast('Network error', false);
    }
  });

  // smooth scrolling for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

})();
