document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
        fetch('data/products.json?v=20260809').then(res => res.json()).catch(() => {
            return new Promise(resolve => {
                Papa.parse('data/products.csv?v=20260809', {
                    download: true,
                    header: true,
                    complete: results => resolve(results.data)
                });
            });
        }),
        fetch('data/filters_esmotech.json?v=20260809').then(res => res.json()).catch(() => ({}))
    ]).then(([products, filtersConfig]) => {
        window.catalogData = products;
        window.filtersConfig = filtersConfig;
        initCatalogView();
        if (window.lucide) lucide.createIcons();
    });
});

const categoryNames = {
    'CAT-01': "Eines de Tall (Skinners, Cutters)",
    'CAT-02': "Serra Cinta (Carn, Os, Congelat, Aviram)",
    'CAT-03': "Ganivetes d'Envasat & Termoformat",
    'CAT-04': "Circulars i Evolutives Hagedorn",
    'CAT-05': "Capçals Tèrmics d'Impressió",
    'CAT-06': "Abrasius i Esmolat Industrial"
};

const categoryShortNames = {
    'CAT-01': "Eines de Tall",
    'CAT-02': "Serra Cinta",
    'CAT-03': "Ganivetes d'Envasat",
    'CAT-04': "Circulars & Evolutives",
    'CAT-05': "Capçals Tèrmics",
    'CAT-06': "Abrasius & Esmolat"
};

const categoryIcons = {
    'CAT-01': 'scissors',
    'CAT-02': 'git-commit',
    'CAT-03': 'package',
    'CAT-04': 'disc',
    'CAT-05': 'thermometer',
    'CAT-06': 'zap'
};

function generateSlug(text) {
    if (!text) return 'producte';
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-\+/g, '-');
}

function initCatalogView() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage.includes('catalogo.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const catParam = urlParams.get('cat');
        const brandParam = urlParams.get('brand');
        const qParam = urlParams.get('q');
        
        const hubView = document.getElementById('catalog-hub-view');
        const filteredView = document.getElementById('catalog-filtered-view');
        const breadcrumbCurrent = document.getElementById('breadcrumb-current');
        
        if (!catParam && !brandParam && !qParam) {
            if (hubView) hubView.style.display = 'block';
            if (filteredView) filteredView.style.display = 'none';
            if (breadcrumbCurrent) breadcrumbCurrent.textContent = 'Catàleg General';
        } else {
            if (hubView) hubView.style.display = 'none';
            if (filteredView) filteredView.style.display = 'block';
            
            const selectedCats = catParam ? catParam.split(',') : [];
            const selectedBrands = brandParam ? brandParam.split(',') : [];
            
            if (selectedCats.length > 0) {
                document.querySelectorAll('input[name="cat"]').forEach(cb => {
                    if (selectedCats.includes(cb.value)) cb.checked = true;
                });
                updateAccordionHeaderTitle('cat-content', selectedCats.map(c => categoryShortNames[c] || c).join(', '));
                // Auto collapse category panel by default so it shows compact
                const catContent = document.getElementById('cat-content');
                if (catContent) catContent.classList.add('collapsed');
            }
            if (selectedBrands.length > 0) {
                document.querySelectorAll('input[name="brand"]').forEach(cb => {
                    if (selectedBrands.includes(cb.value)) cb.checked = true;
                });
                updateAccordionHeaderTitle('brand-content', selectedBrands.join(', '));
            }
            
            const searchInput = document.getElementById('sidebar-search-input');
            if (qParam && searchInput) searchInput.value = qParam;
            
            const titleEl = document.getElementById('filtered-category-title');
            const subTitleEl = document.getElementById('filtered-category-subtitle');
            
            if (selectedCats.length === 1 && categoryNames[selectedCats[0]]) {
                const catTitle = categoryNames[selectedCats[0]];
                if (titleEl) titleEl.textContent = catTitle;
                if (subTitleEl) subTitleEl.textContent = "Filtratge multifacètic per marca, màquina i aliatges";
                if (breadcrumbCurrent) breadcrumbCurrent.textContent = catTitle;
            } else if (selectedBrands.length > 0) {
                const bTitle = `Productes ${selectedBrands.join(', ')}`;
                if (titleEl) titleEl.textContent = bTitle;
                if (subTitleEl) subTitleEl.textContent = "Filtratge per fabricant";
                if (breadcrumbCurrent) breadcrumbCurrent.textContent = bTitle;
            } else if (qParam) {
                if (titleEl) titleEl.textContent = `Cerca: "${qParam}"`;
                if (subTitleEl) subTitleEl.textContent = "Resultats del cercador";
                if (breadcrumbCurrent) breadcrumbCurrent.textContent = `Cerca "${qParam}"`;
            }
            
            renderDynamicFilters(selectedCats);
            renderProductsGrid(window.catalogData, selectedCats, selectedBrands, qParam || '');
            setupFilters();
        }
    } else if (currentPage.includes('cerca.html')) {
        renderSearchResults();
    } else if (currentPage.includes('tekblade.html')) {
        renderTekbladeProducts();
    }
}

function updateAccordionHeaderTitle(contentId, selectedText) {
    const contentEl = document.getElementById(contentId);
    if (!contentEl) return;
    const headerBtn = document.querySelector(`button[data-accordion="${contentId}"]`);
    if (!headerBtn) return;
    
    const titleSpan = headerBtn.querySelector('span');
    if (!titleSpan) return;
    
    let baseLabel = "Categoria";
    if (contentId === 'brand-content') baseLabel = "Marca / Fabricant";
    else if (contentId === 'cat-content') baseLabel = "Categoria Activa";
    
    if (selectedText && selectedText.trim()) {
        titleSpan.innerHTML = `<i data-lucide="check-circle" style="width: 16px; color: var(--primary); vertical-align: middle; margin-right: 6px;"></i> ${baseLabel}: <strong style="color: var(--primary);">${selectedText}</strong>`;
    } else {
        titleSpan.innerHTML = `<i data-lucide="layers" style="width: 16px; color: var(--primary); vertical-align: middle; margin-right: 6px;"></i> ${baseLabel}`;
    }
    if (window.lucide) lucide.createIcons();
}

function renderDynamicFilters(selectedCats = []) {
    const container = document.getElementById('dynamic-filters-container');
    if (!container || !window.filtersConfig) return;
    
    let catKey = selectedCats.length === 1 ? selectedCats[0] : null;
    if (!catKey) {
        const urlParams = new URLSearchParams(window.location.search);
        catKey = urlParams.get('cat') || null;
    }
    
    // Store current state to prevent losing checked checkboxes on re-triggering product grid
    if (window.lastRenderedCatKey === catKey) return;
    window.lastRenderedCatKey = catKey;

    container.innerHTML = '';
    
    if (!catKey || !window.filtersConfig[catKey]) return;
    
    const catData = window.filtersConfig[catKey];
    
    catData.filters.forEach((filter, idx) => {
        if (!filter.options || filter.options.length === 0) return;
        
        const accordionId = `dyn-acc-${idx}`;
        const hasInnerSearch = filter.options.length >= 5;
        
        let searchInputHtml = '';
        if (hasInnerSearch) {
            searchInputHtml = `<input type="text" class="filter-search-box dyn-search-input" data-target-list="dyn-list-${idx}" placeholder="Buscar en ${filter.label}...">`;
        }
        
        let checkboxesHtml = filter.options.map(opt => `
            <label class="checkbox-label" data-opt-name="${opt.toLowerCase()}">
                <span><input type="checkbox" class="dyn-filter-cb" data-filter-id="${filter.id}" value="${opt}"> ${opt}</span>
            </label>
        `).join('');
        
        const accordionHtml = `
            <div class="accordion-item">
                <button class="accordion-header" data-accordion="${accordionId}">
                    <span>${filter.label}</span>
                    <i data-lucide="chevron-down" class="accordion-icon" style="width: 16px;"></i>
                </button>
                <div id="${accordionId}" class="accordion-content collapsed">
                    ${searchInputHtml}
                    <div id="dyn-list-${idx}" style="display: flex; flex-direction: column; gap: 0.4rem; max-height: 200px; overflow-y: auto; padding-right: 4px;">
                        ${checkboxesHtml}
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += accordionHtml;
    });
    
    if (window.lucide) lucide.createIcons();
    
    // Bind Accordion Click Toggles
    container.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.getAttribute('data-accordion');
            const content = document.getElementById(targetId);
            const icon = header.querySelector('.accordion-icon');
            if (content) {
                content.classList.toggle('collapsed');
                if (icon) icon.classList.toggle('rotated');
            }
        });
    });
    
    // Bind Inner Search Filters
    container.querySelectorAll('.dyn-search-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase().trim();
            const listId = input.getAttribute('data-target-list');
            const listEl = document.getElementById(listId);
            if (listEl) {
                listEl.querySelectorAll('.checkbox-label').forEach(lbl => {
                    const optName = lbl.getAttribute('data-opt-name') || '';
                    if (optName.includes(q) || lbl.textContent.toLowerCase().includes(q)) {
                        lbl.style.display = 'flex';
                    } else {
                        lbl.style.display = 'none';
                    }
                });
            }
        });
    });
    
    // Bind Dynamic Checkboxes Change Events
    container.querySelectorAll('.dyn-filter-cb').forEach(cb => {
        cb.addEventListener('change', triggerFilter);
    });
}

function triggerFilter() {
    const selectedCats = Array.from(document.querySelectorAll('input[name="cat"]:checked')).map(cb => cb.value);
    const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(cb => cb.value);
    const searchVal = (document.getElementById('sidebar-search-input') || {}).value || '';
    
    // Re-render dynamic filters if active category changed
    renderDynamicFilters(selectedCats);

    // Collect active dynamic accordion multi-select checkboxes
    const activeDynFilters = {};
    document.querySelectorAll('.dyn-filter-cb:checked').forEach(cb => {
        const filterId = cb.getAttribute('data-filter-id');
        if (!activeDynFilters[filterId]) activeDynFilters[filterId] = [];
        activeDynFilters[filterId].push(cb.value.toLowerCase());
    });
    
    renderProductsGrid(window.catalogData, selectedCats, selectedBrands, searchVal, activeDynFilters);
}

function renderProductsGrid(products, selectedCats = [], selectedBrands = [], searchQuery = '', dynamicFilters = {}) {
    const grid = document.getElementById('products-grid');
    const countEl = document.getElementById('results-count');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    let filtered = products.filter(p => p.ref_interna || p.nom_ca);
    
    // 1. Filter by Categories
    if (selectedCats.length > 0) {
        filtered = filtered.filter(p => selectedCats.includes(p.categoria_id));
    }
    
    // 2. Filter by Brands
    if (selectedBrands.length > 0) {
        filtered = filtered.filter(p => {
            return selectedBrands.some(brand => {
                if (brand === 'Hagedorn') return p.marca && p.marca.includes('Hagedorn');
                return p.marca && p.marca.toLowerCase().includes(brand.toLowerCase());
            });
        });
    }
    
    // 3. Filter by Dynamic Accordion Checkboxes (Multi-select)
    Object.keys(dynamicFilters).forEach(filterId => {
        const selectedVals = dynamicFilters[filterId];
        if (selectedVals.length > 0) {
            filtered = filtered.filter(p => {
                const searchHaystack = `${p.nom_ca} ${p.descripcio_curta_ca} ${p.maquines_compatibles} ${p.material_aliatge} ${p.dimensions}`.toLowerCase();
                return selectedVals.some(val => searchHaystack.includes(val));
            });
        }
    });
    
    
    // 4. Filter by Text Search Query
    if (searchQuery.trim().length > 0) {
        const qLower = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p => {
            return (p.nom_ca && p.nom_ca.toLowerCase().includes(qLower)) ||
                   (p.ref_interna && p.ref_interna.toLowerCase().includes(qLower)) ||
                   (p.ref_oem && p.ref_oem.toLowerCase().includes(qLower)) ||
                   (p.maquines_compatibles && p.maquines_compatibles.toLowerCase().includes(qLower)) ||
                   (p.material_aliatge && p.material_aliatge.toLowerCase().includes(qLower)) ||
                   (p.marca && p.marca.toLowerCase().includes(qLower));
        });
    }
    
    // 5. Sort
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        const sortVal = sortSelect.value;
        if (sortVal === 'ref') {
            filtered.sort((a, b) => (a.ref_interna || '').localeCompare(b.ref_interna || ''));
        } else if (sortVal === 'nom') {
            filtered.sort((a, b) => (a.nom_ca || '').localeCompare(b.nom_ca || ''));
        }
    }
    
    if (countEl) {
        countEl.textContent = `${filtered.length} productes trobats`;
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = `<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 3rem;">No s'han trobat productes amb aquests filtres.</p>`;
        return;
    }
    
    filtered.forEach((product, index) => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        
        const iconName = categoryIcons[product.categoria_id] || 'box';
        const bgNum = (index + 1).toString().padStart(2, '0');
        
        let brandBadge = '';
        if (product.marca === 'TEKBLADE') {
            brandBadge = '<span class="badge badge-gold" style="margin-bottom: 0.8rem; display: inline-block;">⭐ TEKBLADE</span>';
        } else {
            brandBadge = `<span class="badge" style="background: var(--bg-tertiary); margin-bottom: 0.8rem; display: inline-block; border: 1px solid var(--border-color);">${product.marca || 'ESMOTECH'}</span>`;
        }

        const productSlug = `${generateSlug(product.nom_ca || 'producte')}-${(product.ref_interna || '').toLowerCase()}`;

        let mainImg = product.imatge;
        if (!mainImg || mainImg === 'default.jpg') {
            mainImg = product.imatge_principal;
        }
        if (!mainImg && product.imatges && product.imatges[0]) {
            mainImg = product.imatges[0].src ? product.imatges[0].src.replace('../', '') : '';
        }
        if (!mainImg) {
            mainImg = 'img/products/placeholder.jpg';
        }

        card.onclick = (e) => {
            // Prevent duplicate navigation if clicking inside button
            if (e.target.tagName !== 'A' && !e.target.closest('a')) {
                window.location.href = `productes/${productSlug}.html`;
            }
        };
        card.style.cursor = 'pointer';

        card.innerHTML = `
            <div class="product-card-bg-num">${bgNum}</div>
            
            <!-- PRODUCT IMAGE CONTAINER (DARK INDUSTRIAL STYLE) -->
            <div class="product-img-box" style="width: 100%; height: 200px; background: #07080a; border-radius: var(--border-radius-sm); overflow: hidden; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; border: 1px solid var(--border-color); position: relative; padding: 0.8rem;">
                <img src="${mainImg}" alt="${product.nom_ca || 'Producte'}" onerror="this.onerror=null; this.src='img/products/placeholder.jpg';" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                <div style="position: absolute; top: 8px; right: 8px; z-index: 2;">${brandBadge}</div>
            </div>
            
            <!-- TITLE & REF -->
            <h3 class="font-display product-title" style="font-size: 1.15rem; margin-bottom: 0.3rem; color: var(--text-primary); font-weight: 700; text-transform: uppercase;">${product.nom_ca || 'Ganiveta Industrial'}</h3>
            <p class="text-xs text-primary" style="margin-bottom: 1rem; letter-spacing: 0.05em; text-transform: uppercase; font-weight: 600;">REF: ${product.ref_interna || 'OEM'} ${product.dimensions ? `| ${product.dimensions}` : ''}</p>

            <!-- CARACTERÍSTIQUES BOX (DARK THEME WITH GOLD ACCENTS) -->
            <div class="specs-box" style="background: var(--bg-tertiary); color: var(--text-primary); padding: 1rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color); margin-bottom: 1.2rem; flex-grow: 1;">
                <h4 style="color: var(--primary); font-size: 0.92rem; font-weight: 700; margin-top: 0; margin-bottom: 0.6rem; font-family: var(--font-display); text-transform: uppercase; letter-spacing: 0.04em;">Característiques</h4>
                <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.85rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.45rem;">
                    <li><strong style="color: var(--text-primary);">- Compatibilitat:</strong> ${product.maquines_compatibles || 'Multimarca'}</li>
                    <li><strong style="color: var(--text-primary);">- Material:</strong> ${product.material || product.material_aliatge || 'Acer Inox'}</li>
                    ${product.dimensions ? `<li><strong style="color: var(--text-primary);">- Dimensions:</strong> ${product.dimensions}</li>` : ''}
                    ${product.descripcio_curta_ca ? `<li><strong style="color: var(--text-primary);">- Specs:</strong> ${product.descripcio_curta_ca}</li>` : ''}
                </ul>
            </div>

            <!-- FITXA TÈCNICA BUTTON (SINGLE FULL WIDTH BUTTON) -->
            <div style="margin-top: auto;">
                <a href="productes/${productSlug}.html" class="btn btn-secondary text-xs" style="width: 100%; text-align: center; padding: 0.65rem; display: block; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">Fitxa Tècnica <i data-lucide="chevron-right" style="width: 14px; vertical-align: middle;"></i></a>
            </div>
        `;
        grid.appendChild(card);
    });
    
    if (window.lucide) {
        lucide.createIcons();
    }
}

function setupFilters() {
    const catCheckboxes = document.querySelectorAll('input[name="cat"]');
    const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
    const searchInput = document.getElementById('sidebar-search-input');
    const resetBtn = document.getElementById('reset-filters-btn');
    const sortSelect = document.getElementById('sort-select');
    
    const applyFilters = () => {
        const selectedCats = Array.from(document.querySelectorAll('input[name="cat"]:checked')).map(cb => cb.value);
        const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(cb => cb.value);
        
        // Update accordion titles
        updateAccordionHeaderTitle('cat-content', selectedCats.map(c => categoryShortNames[c] || c).join(', '));
        updateAccordionHeaderTitle('brand-content', selectedBrands.join(', '));
        
        triggerFilter();
        
        const searchVal = searchInput ? searchInput.value : '';
        const url = new URL(window.location);
        if (selectedCats.length > 0) url.searchParams.set('cat', selectedCats.join(','));
        else url.searchParams.delete('cat');
        
        if (selectedBrands.length > 0) url.searchParams.set('brand', selectedBrands.join(','));
        else url.searchParams.delete('brand');
        
        if (searchVal.trim()) url.searchParams.set('q', searchVal.trim());
        else url.searchParams.delete('q');
        
        window.history.pushState({}, '', url);
    };
    
    catCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            window.lastRenderedCatKey = null;
            applyFilters();
            // AUTO COLLAPSE CATEGORY ACCORDION ON SELECTION
            const catContent = document.getElementById('cat-content');
            if (catContent) {
                catContent.classList.add('collapsed');
                const headerBtn = document.querySelector('button[data-accordion="cat-content"]');
                if (headerBtn) {
                    const icon = headerBtn.querySelector('.accordion-icon');
                    if (icon) icon.classList.remove('rotated');
                }
            }
        });
    });
    
    brandCheckboxes.forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });
    
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            catCheckboxes.forEach(cb => cb.checked = false);
            brandCheckboxes.forEach(cb => cb.checked = false);
            document.querySelectorAll('.dyn-filter-cb').forEach(cb => cb.checked = false);
            updateAccordionHeaderTitle('cat-content', '');
            updateAccordionHeaderTitle('brand-content', '');
            if (searchInput) searchInput.value = '';
            window.location.href = 'catalogo.html';
        });
    }
}
