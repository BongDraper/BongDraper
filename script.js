// XP Bliss + Mac Dock Portfolio - Main Script

class VistaDesktop {
    constructor() {
        this.windows = new Map();
        this.activeWindow = null;
        this.zIndex = 100;
        this.windowOffsetX = 80;
        this.windowOffsetY = 60;

        this.init();
    }

    init() {
        this.setupDesktopIcons();
        this.setupDock();
        this.setupDesktopClick();
    }

    // Desktop Icons
    setupDesktopIcons() {
        const icons = document.querySelectorAll('.desktop-icon');
        icons.forEach(icon => {
            icon.addEventListener('dblclick', () => {
                const projectId = icon.dataset.project;
                this.openWindow(projectId);
            });

            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectIcon(icon);
            });

            // Touch support for mobile
            let touchTimer;
            icon.addEventListener('touchstart', () => {
                touchTimer = setTimeout(() => {
                    const projectId = icon.dataset.project;
                    this.openWindow(projectId);
                }, 300);
            });

            icon.addEventListener('touchend', () => {
                clearTimeout(touchTimer);
            });
        });
    }

    selectIcon(icon) {
        document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
    }

    setupDesktopClick() {
        document.getElementById('desktop').addEventListener('click', (e) => {
            if (e.target.id === 'desktop' || e.target.classList.contains('desktop-icons')) {
                document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
            }
        });
    }

    // Dock Management
    setupDock() {
        const dock = document.getElementById('dock');
        const dockContainer = document.getElementById('dock-container');

        // Dock items click handler
        dock.querySelectorAll('.dock-item[data-project]').forEach(item => {
            item.addEventListener('click', () => {
                const projectId = item.dataset.project;
                this.openWindow(projectId);
            });
        });

        // Dock actions
        dock.querySelectorAll('.dock-item[data-action]').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                if (action === 'linkedin') {
                    window.open('https://www.linkedin.com/in/mgaudelli/', '_blank');
                }
            });
        });

        // Show dock when mouse near bottom
        document.addEventListener('mousemove', (e) => {
            const threshold = 50;
            if (window.innerHeight - e.clientY < threshold) {
                dockContainer.classList.add('active');
            }
        });
    }

    addDockItem(projectId, title) {
        const dockWindows = document.getElementById('dock-windows');
        const separatorEnd = document.getElementById('dock-separator-end');

        // Check if already exists
        if (dockWindows.querySelector(`[data-project-id="${projectId}"]`)) {
            return;
        }

        // Map project IDs to real Mac OS X Yosemite icons (using ones that work)
        const iconMap = {
            'tmobile': 'https://icons.iconarchive.com/icons/johanchalibert/mac-osx-yosemite/256/preview-icon.png',
            'samsung': 'https://icons.iconarchive.com/icons/johanchalibert/mac-osx-yosemite/256/textedit-icon.png',
            'shibuya': 'https://icons.iconarchive.com/icons/johanchalibert/mac-osx-yosemite/256/maps-icon.png',
            'heineken': 'https://icons.iconarchive.com/icons/johanchalibert/mac-osx-yosemite/256/notes-icon.png',
            'audi': 'https://icons.iconarchive.com/icons/johanchalibert/mac-osx-yosemite/256/reminders-icon.png',
            'kfc': 'https://icons.iconarchive.com/icons/johanchalibert/mac-osx-yosemite/256/calendar-icon.png',
            'about': 'https://icons.iconarchive.com/icons/johanchalibert/mac-osx-yosemite/256/contacts-icon.png',
            'contact': 'https://icons.iconarchive.com/icons/johanchalibert/mac-osx-yosemite/256/mail-icon.png',
            'music': 'https://icons.iconarchive.com/icons/johanchalibert/mac-osx-yosemite/256/facetime-icon.png'
        };

        const iconUrl = iconMap[projectId] || 'https://icons.iconarchive.com/icons/johanchalibert/mac-osx-yosemite/256/finder-icon.png';

        const item = document.createElement('div');
        item.className = 'dock-item active';
        item.dataset.projectId = projectId;
        item.innerHTML = `
            <div class="dock-icon">
                <img src="${iconUrl}" alt="${title}">
            </div>
            <span class="dock-tooltip">${title}</span>
        `;

        item.addEventListener('click', () => {
            const windowObj = this.windows.get(projectId);
            if (!windowObj) return;

            if (windowObj.isMinimized) {
                windowObj.element.classList.remove('minimized');
                windowObj.isMinimized = false;
                this.focusWindow(windowObj);
            } else if (this.activeWindow?.id === projectId) {
                this.minimizeWindow(projectId);
            } else {
                this.focusWindow(windowObj);
            }
        });

        dockWindows.appendChild(item);
        separatorEnd.style.display = 'block';
    }

    removeDockItem(projectId) {
        const dockWindows = document.getElementById('dock-windows');
        const item = dockWindows.querySelector(`[data-project-id="${projectId}"]`);
        if (item) {
            item.remove();
        }

        // Hide separator if no windows
        if (dockWindows.children.length === 0) {
            document.getElementById('dock-separator-end').style.display = 'none';
        }
    }

    updateDockItem(projectId, isMinimized) {
        const item = document.querySelector(`.dock-item[data-project-id="${projectId}"]`);
        if (item) {
            item.classList.toggle('active', !isMinimized);
        }
    }

    // Window Management
    openWindow(projectId) {
        // If window already exists, focus it
        if (this.windows.has(projectId)) {
            const existingWindow = this.windows.get(projectId);
            existingWindow.element.classList.remove('minimized');
            existingWindow.isMinimized = false;
            this.focusWindow(existingWindow);
            this.updateDockItem(projectId, false);
            return;
        }

        const project = PROJECTS[projectId];
        if (!project) return;

        const template = document.getElementById('window-template');
        const windowEl = template.content.cloneNode(true).querySelector('.vista-window');

        // Set window properties
        windowEl.querySelector('.window-title').textContent = project.title;
        windowEl.querySelector('.window-content').innerHTML = getProjectContent(projectId);

        // Position window - check for mobile
        const isMobile = window.innerWidth <= 768;
        const offset = this.windows.size * 30;

        if (isMobile) {
            // On mobile, position at top of screen
            windowEl.style.left = '2.5vw';
            windowEl.style.top = '10px';
            windowEl.style.width = '95vw';
            windowEl.style.height = '70vh';
        } else {
            windowEl.style.left = `${this.windowOffsetX + offset}px`;
            windowEl.style.top = `${this.windowOffsetY + offset}px`;
            windowEl.style.width = '700px';
            windowEl.style.height = '500px';
        }
        windowEl.dataset.projectId = projectId;

        // Add resize handles
        this.addResizeHandles(windowEl);

        // Add to container
        document.getElementById('windows-container').appendChild(windowEl);

        // Create window object
        const windowObj = {
            id: projectId,
            element: windowEl,
            isMaximized: false,
            isMinimized: false,
            savedState: null
        };

        this.windows.set(projectId, windowObj);
        this.setupWindowControls(windowObj);
        this.setupWindowDrag(windowObj);
        this.focusWindow(windowObj);
        this.addDockItem(projectId, project.title);

        // Initialize music player if this is the music window
        if (projectId === 'music') {
            this.initMusicPlayer(windowObj);
        }
    }

    initMusicPlayer(windowObj) {
        const canvas = windowObj.element.querySelector('#visualizer-canvas');
        if (!canvas || !window.AmbientVisualizer) return;

        const visualizer = new AmbientVisualizer(canvas);
        windowObj.visualizer = visualizer;

        // Start automatically
        visualizer.start();

        // Play/Pause button
        const playBtn = windowObj.element.querySelector('#play-btn');
        const playIcon = playBtn.querySelector('.play-icon');
        const pauseIcon = playBtn.querySelector('.pause-icon');
        let isPlaying = true;

        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                visualizer.stop();
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            } else {
                visualizer.start();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            }
            isPlaying = !isPlaying;
        });

        // Initially show pause icon since we auto-start
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';

        // Color scheme button
        const schemeBtn = windowObj.element.querySelector('#scheme-btn');
        const schemeNames = ['Energy Bliss', 'Ambient Blue', 'Aurora', 'Sunset'];
        let currentScheme = 0;

        schemeBtn.addEventListener('click', () => {
            visualizer.cycleColors();
            currentScheme = (currentScheme + 1) % schemeNames.length;
            windowObj.element.querySelector('.track-artist').textContent = schemeNames[currentScheme] + ' Mode';
        });

        // Prev/Next buttons cycle colors too
        windowObj.element.querySelector('#prev-btn').addEventListener('click', () => {
            visualizer.cycleColors();
            visualizer.cycleColors();
            visualizer.cycleColors(); // Go back one
            currentScheme = (currentScheme - 1 + schemeNames.length) % schemeNames.length;
            windowObj.element.querySelector('.track-artist').textContent = schemeNames[currentScheme] + ' Mode';
        });

        windowObj.element.querySelector('#next-btn').addEventListener('click', () => {
            visualizer.cycleColors();
            currentScheme = (currentScheme + 1) % schemeNames.length;
            windowObj.element.querySelector('.track-artist').textContent = schemeNames[currentScheme] + ' Mode';
        });

        // Handle resize
        const resizeObserver = new ResizeObserver(() => {
            visualizer.resize();
        });
        resizeObserver.observe(windowObj.element.querySelector('.visualizer-container'));
        windowObj.resizeObserver = resizeObserver;
    }

    addResizeHandles(windowEl) {
        const handles = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
        handles.forEach(dir => {
            const handle = document.createElement('div');
            handle.className = `resize-handle ${dir}`;
            windowEl.appendChild(handle);
        });
    }

    setupWindowControls(windowObj) {
        const { element, id } = windowObj;

        // Close button
        element.querySelector('.close-btn').addEventListener('click', () => {
            this.closeWindow(id);
        });

        // Minimize button
        element.querySelector('.minimize-btn').addEventListener('click', () => {
            this.minimizeWindow(id);
        });

        // Maximize button
        element.querySelector('.maximize-btn').addEventListener('click', () => {
            this.toggleMaximize(id);
        });

        // Double-click titlebar to maximize
        element.querySelector('.window-titlebar').addEventListener('dblclick', (e) => {
            if (!e.target.closest('.window-controls')) {
                this.toggleMaximize(id);
            }
        });

        // Focus on click
        element.addEventListener('mousedown', () => {
            this.focusWindow(windowObj);
        });

        // Resize handles
        this.setupResize(windowObj);
    }

    setupWindowDrag(windowObj) {
        const { element } = windowObj;
        const titlebar = element.querySelector('.window-titlebar');

        let isDragging = false;
        let startX, startY, startLeft, startTop;

        const startDrag = (clientX, clientY) => {
            if (windowObj.isMaximized) return;

            isDragging = true;
            startX = clientX;
            startY = clientY;
            startLeft = element.offsetLeft;
            startTop = element.offsetTop;

            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', onDragEnd);
            document.addEventListener('touchmove', onTouchDrag, { passive: false });
            document.addEventListener('touchend', onDragEnd);
        };

        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-controls')) return;
            startDrag(e.clientX, e.clientY);
        });

        titlebar.addEventListener('touchstart', (e) => {
            if (e.target.closest('.window-controls')) return;
            const touch = e.touches[0];
            startDrag(touch.clientX, touch.clientY);
        });

        const onDrag = (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            element.style.left = `${startLeft + dx}px`;
            element.style.top = `${startTop + dy}px`;
        };

        const onTouchDrag = (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const touch = e.touches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;

            element.style.left = `${startLeft + dx}px`;
            element.style.top = `${startTop + dy}px`;
        };

        const onDragEnd = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', onDragEnd);
            document.removeEventListener('touchmove', onTouchDrag);
            document.removeEventListener('touchend', onDragEnd);
        };
    }

    setupResize(windowObj) {
        const { element } = windowObj;
        const handles = element.querySelectorAll('.resize-handle');

        handles.forEach(handle => {
            let isResizing = false;
            let startX, startY, startWidth, startHeight, startLeft, startTop;
            const direction = handle.className.split(' ')[1];

            handle.addEventListener('mousedown', (e) => {
                if (windowObj.isMaximized) return;

                e.preventDefault();
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = element.offsetWidth;
                startHeight = element.offsetHeight;
                startLeft = element.offsetLeft;
                startTop = element.offsetTop;

                document.addEventListener('mousemove', onResize);
                document.addEventListener('mouseup', onResizeEnd);
            });

            const onResize = (e) => {
                if (!isResizing) return;

                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                if (direction.includes('e')) {
                    element.style.width = `${Math.max(400, startWidth + dx)}px`;
                }
                if (direction.includes('w')) {
                    const newWidth = Math.max(400, startWidth - dx);
                    if (newWidth !== startWidth - dx + 400) {
                        element.style.width = `${newWidth}px`;
                        element.style.left = `${startLeft + (startWidth - newWidth)}px`;
                    }
                }
                if (direction.includes('s')) {
                    element.style.height = `${Math.max(300, startHeight + dy)}px`;
                }
                if (direction.includes('n')) {
                    const newHeight = Math.max(300, startHeight - dy);
                    if (newHeight !== startHeight - dy + 300) {
                        element.style.height = `${newHeight}px`;
                        element.style.top = `${startTop + (startHeight - newHeight)}px`;
                    }
                }
            };

            const onResizeEnd = () => {
                isResizing = false;
                document.removeEventListener('mousemove', onResize);
                document.removeEventListener('mouseup', onResizeEnd);
            };
        });
    }

    focusWindow(windowObj) {
        // Unfocus all windows
        this.windows.forEach((w) => {
            w.element.classList.remove('focused');
            w.element.classList.add('unfocused');
        });

        // Focus the target window
        this.activeWindow = windowObj;
        this.zIndex++;
        windowObj.element.style.zIndex = this.zIndex;
        windowObj.element.classList.remove('unfocused');
        windowObj.element.classList.add('focused');

        // Update dock active states
        document.querySelectorAll('.dock-item[data-project-id]').forEach(item => {
            item.classList.toggle('active', item.dataset.projectId === windowObj.id);
        });
    }

    closeWindow(projectId) {
        const windowObj = this.windows.get(projectId);
        if (!windowObj) return;

        // Clean up visualizer if present
        if (windowObj.visualizer) {
            windowObj.visualizer.stop();
        }
        if (windowObj.resizeObserver) {
            windowObj.resizeObserver.disconnect();
        }

        windowObj.element.remove();
        this.windows.delete(projectId);
        this.removeDockItem(projectId);

        if (this.activeWindow?.id === projectId) {
            this.activeWindow = null;
        }
    }

    minimizeWindow(projectId) {
        const windowObj = this.windows.get(projectId);
        if (!windowObj) return;

        windowObj.element.classList.add('minimized');
        windowObj.isMinimized = true;
        this.updateDockItem(projectId, true);

        if (this.activeWindow?.id === projectId) {
            this.activeWindow = null;
        }
    }

    toggleMaximize(projectId) {
        const windowObj = this.windows.get(projectId);
        if (!windowObj) return;

        if (windowObj.isMaximized) {
            // Restore
            const { left, top, width, height } = windowObj.savedState;
            windowObj.element.style.left = left;
            windowObj.element.style.top = top;
            windowObj.element.style.width = width;
            windowObj.element.style.height = height;
            windowObj.element.classList.remove('maximized');
            windowObj.isMaximized = false;
        } else {
            // Maximize
            windowObj.savedState = {
                left: windowObj.element.style.left,
                top: windowObj.element.style.top,
                width: windowObj.element.style.width,
                height: windowObj.element.style.height
            };
            windowObj.element.classList.add('maximized');
            windowObj.isMaximized = true;
        }
    }
}

// Update menubar clock
function updateMenubarClock() {
    const timeEl = document.getElementById('menubar-time');
    if (timeEl) {
        const now = new Date();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = days[now.getDay()];
        const month = months[now.getMonth()];
        const date = now.getDate();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        timeEl.textContent = `${day} ${month} ${date}  ${displayHours}:${minutes} ${ampm}`;
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Wait a tick for projects.js to finish rendering icons
    setTimeout(() => {
        window.vistaDesktop = new VistaDesktop();
    }, 100);

    updateMenubarClock();
    setInterval(updateMenubarClock, 1000);
});
