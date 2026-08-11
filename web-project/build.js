const fs = require('fs');
const path = require('path');

// Setup dirs
const srcDir = __dirname;
const distDir = path.join(__dirname, 'dist');
const distProdDir = path.join(distDir, 'productes');
const rootProdDir = path.join(srcDir, 'productes');
if (!fs.existsSync(rootProdDir)) fs.mkdirSync(rootProdDir, { recursive: true });
const distImgDir = path.join(distDir, 'img', 'products');
const distPdfDir = path.join(distDir, 'pdf', 'fitxes');

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);
if (!fs.existsSync(distProdDir)) fs.mkdirSync(distProdDir, { recursive: true });
if (!fs.existsSync(distImgDir)) fs.mkdirSync(distImgDir, { recursive: true });
if (!fs.existsSync(distPdfDir)) fs.mkdirSync(distPdfDir, { recursive: true });

function slugify(text) {
    if (!text) return '';
    const a = 'àáäâèéëêìíïîòóöôùúüûñç';
    const b = 'aaaaeeeeiiiioooouuuunc';
    const p = new RegExp(a.split('').join('|'), 'g');
    
    return text.toString().toLowerCase()
      .replace(p, c => b.charAt(a.indexOf(c)))
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
}

// Check master CSV with Pare/Fill structure or default CSV
const masterCsvPath = path.join(srcDir, 'data', 'catalog_master.csv');
const defaultCsvPath = path.join(srcDir, 'data', 'products.csv');
const activeCsvPath = fs.existsSync(masterCsvPath) ? masterCsvPath : defaultCsvPath;

const csv = fs.readFileSync(activeCsvPath, 'utf-8');
const lines = csv.split('\n').filter(l => l.trim().length > 0);
const headers = lines[0].split(',');

const isMasterFormat = headers.includes('id_categoria_pare');

// Funció d'Escaneig i Renomenament SEO Automàtic d'Imatges
function autoScanAndRenameSeoImages(refInterna, rawPath, productName, brand) {
    const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
    let sourceFiles = [];
    
    // 1. Cercar carpeta per ruta o per referència
    let targetDir = '';
    if (rawPath && rawPath.length > 0) {
        let candidate = path.join(srcDir, rawPath);
        if (fs.existsSync(candidate) && fs.lstatSync(candidate).isDirectory()) {
            targetDir = candidate;
        }
    }
    
    if (!targetDir && refInterna) {
        let candidate = path.join(srcDir, 'img', 'products', refInterna);
        if (fs.existsSync(candidate) && fs.lstatSync(candidate).isDirectory()) {
            targetDir = candidate;
        }
    }
    
    if (targetDir) {
        const files = fs.readdirSync(targetDir);
        files.sort().forEach(f => {
            const ext = path.extname(f).toLowerCase();
            if (validExts.includes(ext)) {
                sourceFiles.push(path.join(targetDir, f));
            }
        });
    }
    
    if (sourceFiles.length === 0 && rawPath && rawPath.length > 0) {
        const rawList = rawPath.split(/[;,]/).map(i => i.trim()).filter(i => i.length > 0);
        rawList.forEach(item => {
            let candidate = path.join(srcDir, item);
            if (fs.existsSync(candidate) && fs.lstatSync(candidate).isFile()) {
                sourceFiles.push(candidate);
            }
        });
    }
    
    // 2. Si no hi ha cap fitxer, retornar placeholder
    if (sourceFiles.length === 0) {
        return [{
            src: '../img/products/placeholder.jpg',
            alt: `${productName} Ref. ${refInterna} - ESMOTECH Eines de Tall`,
            title: `${productName} Ref. ${refInterna}`
        }];
    }
    
    // 3. Renomenar automàticament amb Patró SEO Netejat
    // Patró SEO: nom-producte-marca-ref-1.jpg
    const seoSlug = slugify(`${productName}-${brand}-${refInterna}`);
    let seoImages = [];
    
    sourceFiles.forEach((srcFilePath, idx) => {
        const ext = path.extname(srcFilePath).toLowerCase();
        const seoFileName = `${seoSlug}-${idx + 1}${ext}`;
        const destFilePath = path.join(distImgDir, seoFileName);
        
        // Copiar el fitxer original amb el nou nom SEO optimitzat a /dist/img/products/
        fs.copyFileSync(srcFilePath, destFilePath);
        
        const relativeDistPath = `../img/products/${seoFileName}`;
        const altText = `${productName} (${brand} Ref. ${refInterna}) - Vista ${idx + 1} per a indústria alimentària`;
        
        seoImages.push({
            src: relativeDistPath,
            alt: altText,
            title: `${productName} - Ref. ${refInterna}`
        });
    });
    
    return seoImages;
}

const products = lines.slice(1).map(line => {
    const values = line.split(',');
    let obj = {};
    headers.forEach((h, i) => obj[h.trim()] = values[i] ? values[i].trim() : '');
    
    const ref = obj.id_article_fill || obj.ref_interna;
    const name = obj.nom_article_fill || obj.nom_ca;
    const brand = obj.marca || 'ESMOTECH';
    const rawImgPath = obj.carpeta_imatges || obj.ruta_imatges || obj.ruta_imatge || '';
    
    const imageList = autoScanAndRenameSeoImages(ref, rawImgPath, name, brand);
    
    if (isMasterFormat) {
        return {
            categoria_id: obj.id_categoria_pare,
            familia_pare_id: obj.id_familia_pare,
            nom_familia_pare: obj.nom_familia_pare,
            ref_interna: obj.id_article_fill,
            nom_ca: obj.nom_article_fill,
            marca: obj.marca,
            maquines_compatibles: obj.maquines_compatibles,
            material: obj.material_aliatge,
            dimensions: obj.dimensions,
            recobriment: obj.recobriment,
            aplicacio: obj.aplicacio_sector,
            imatges: imageList,
            pdf_fitxa_tecnica: obj.pdf_fitxa_tecnica || '',
            descripcio_curta_ca: obj.descripcio_curta
        };
    } else {
        return {
            categoria_id: obj.categoria_id,
            familia_pare_id: obj.categoria_id,
            nom_familia_pare: obj.nom_ca,
            ref_interna: obj.ref_interna,
            nom_ca: obj.nom_ca,
            marca: obj.marca,
            ref_proveidor: obj.ref_proveidor,
            maquines_compatibles: obj.maquines_compatibles,
            material: obj.material,
            dimensions: obj.dimensions,
            recobriment: 'Standard',
            aplicacio: 'Alimentari',
            imatges: imageList,
            pdf_fitxa_tecnica: obj.pdf_fitxa_tecnica || '',
            descripcio_curta_ca: obj.descripcio_curta_ca
        };
    }
});

// Add main_image property to each product
products.forEach(p => {
    p.imatge_principal = p.imatges && p.imatges[0] ? p.imatges[0].src.replace('../', '') : 'img/products/placeholder.jpg';
});

// Export products.json to data folder
fs.mkdirSync(path.join(srcDir, 'data'), { recursive: true });
fs.writeFileSync(path.join(srcDir, 'data', 'products.json'), JSON.stringify(products, null, 2));

const categoryNames = {
    'CAT-01': 'Eines de Tall',
    'CAT-02': 'Serra Cinta',
    'CAT-03': 'Ganivetes d\'Envasat',
    'CAT-04': 'Circulars i Evolutives',
    'CAT-05': 'Capçals Tèrmics',
    'CAT-06': 'Abrasius'
};

const categoryIcons = {
    'CAT-01': 'scissors',
    'CAT-02': 'git-commit',
    'CAT-03': 'package',
    'CAT-04': 'disc',
    'CAT-05': 'thermometer',
    'CAT-06': 'zap'
};

function copyFolderSync(from, to) {
    if (!fs.existsSync(from)) return;
    if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
    fs.readdirSync(from).forEach(element => {
        const fromPath = path.join(from, element);
        const toPath = path.join(to, element);
        if (fs.lstatSync(fromPath).isFile()) {
            fs.copyFileSync(fromPath, toPath);
        } else {
            copyFolderSync(fromPath, toPath);
        }
    });
}

// Copy assets directly to dist
copyFolderSync(path.join(srcDir, 'css'), path.join(distDir, 'css'));
copyFolderSync(path.join(srcDir, 'js'), path.join(distDir, 'js'));
copyFolderSync(path.join(srcDir, 'data'), path.join(distDir, 'data'));
copyFolderSync(path.join(srcDir, 'serveis'), path.join(distDir, 'serveis'));
copyFolderSync(path.join(srcDir, 'productes'), path.join(distDir, 'productes'));
copyFolderSync(path.join(srcDir, 'pdf'), path.join(distDir, 'pdf'));
copyFolderSync(path.join(srcDir, 'img'), path.join(distDir, 'img'));

const pagesToCopy = ['index.html', 'productos.html', 'tekblade.html', 'contacto.html', 'servicios.html', 'cerca.html', 'catalogo.html'];
pagesToCopy.forEach(page => {
    if (fs.existsSync(path.join(srcDir, page))) {
        let html = fs.readFileSync(path.join(srcDir, page), 'utf-8');
        fs.writeFileSync(path.join(distDir, page), html);
    }
});

let sitemapUrls = [
    'https://www.esmotech.com/',
    'https://www.esmotech.com/productos.html',
    'https://www.esmotech.com/servicios.html',
    'https://www.esmotech.com/contacto.html',
    'https://www.esmotech.com/tekblade.html',
    'https://www.esmotech.com/serveis/esmolat.html',
    'https://www.esmotech.com/serveis/formacio.html',
    'https://www.esmotech.com/serveis/consultoria.html',
    'https://www.esmotech.com/serveis/suport.html'
];

// GENERACIÓ DE FITXES DE PRODUCTE FILL (SSG)
const template = fs.readFileSync(path.join(srcDir, 'template-product.html'), 'utf-8');

products.forEach(p => {
    if (!p.nom_ca || !p.ref_interna) return;
    
    const slug = slugify(p.nom_ca) + '-' + p.ref_interna.toLowerCase();
    sitemapUrls.push(`https://www.esmotech.com/productes/${slug}.html`);
    
    let html = template;
    html = html.replace(/\{\{PRODUCT_NAME\}\}/g, p.nom_ca);
    html = html.replace(/\{\{PRODUCT_REF\}\}/g, p.ref_interna);
    html = html.replace(/\{\{PRODUCT_DESC\}\}/g, p.descripcio_curta_ca);
    
    let brandStyle = 'background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color);';
    if(p.marca === 'TEKBLADE') brandStyle = 'background: var(--primary); color: #000;';
    const brandHtml = `<div style="display: inline-block; margin-bottom: 1rem; padding: 0.5rem 1rem; border-radius: var(--border-radius-sm); font-weight: bold; ${brandStyle}">${p.marca}</div>`;
    html = html.replace(/\{\{PRODUCT_BRAND\}\}/g, brandHtml);
    
    html = html.replace(/\{\{BREADCRUMB_CAT_NAME\}\}/g, categoryNames[p.categoria_id] || 'Productes');
    
    const catUrlMap = {
        'CAT-01': 'eines-de-tall.html',
        'CAT-02': 'serra-cinta.html',
        'CAT-03': 'ganivetes-denvasat.html',
        'CAT-04': 'circulars-i-evolutives.html',
        'CAT-05': 'capcals-termics.html',
        'CAT-06': 'abrasius.html'
    };
    html = html.replace(/\{\{BREADCRUMB_CAT_URL\}\}/g, catUrlMap[p.categoria_id] || '../productos.html');
    
    // Render Multi-Image Gallery amb Noms SEO i Atributs Alt Optimitzats
    const mainImgObj = p.imatges[0] || { src: '../img/products/placeholder.jpg', alt: p.nom_ca, title: p.nom_ca };
    let galleryHtml = `
        <div style="aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; background: #111; border-radius: var(--border-radius-sm); margin-bottom: 1rem; overflow: hidden; border: 1px solid var(--border-color);">
            <img id="main-product-img" src="${mainImgObj.src}" alt="${mainImgObj.alt}" title="${mainImgObj.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
        </div>
    `;
    
    if (p.imatges.length > 1) {
        galleryHtml += `<div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem;">`;
        p.imatges.forEach((imgObj, idx) => {
            galleryHtml += `
                <div style="width: 60px; height: 60px; border-radius: 4px; border: 1px solid var(--border-color); cursor: pointer; overflow: hidden; background: #222;" onclick="document.getElementById('main-product-img').src='${imgObj.src}'; document.getElementById('main-product-img').alt='${imgObj.alt}'">
                    <img src="${imgObj.src}" alt="${imgObj.alt}" title="${imgObj.title}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            `;
        });
        galleryHtml += `</div>`;
    }
    galleryHtml += `<p class="text-xs text-muted" style="text-align: center; margin-top: 0.5rem;">🔍 Imatges Renomenades i Optimitzades per a SEO Google Images (${p.imatges.length} fitxers)</p>`;
    
    html = html.replace(/\{\{PRODUCT_GALLERY_HTML\}\}/g, galleryHtml);

    // Datasheet PDF Download Button
    let datasheetBtnHtml = '';
    if (p.pdf_fitxa_tecnica && p.pdf_fitxa_tecnica.length > 0) {
        datasheetBtnHtml = `
            <a href="../${p.pdf_fitxa_tecnica}" download class="btn btn-secondary" style="flex: 1; justify-content: center; min-width: 200px;">
                <i data-lucide="file-text" style="width: 20px; height: 20px; margin-right: 8px;"></i>
                Descarregar Fitxa Tècnica (PDF)
            </a>
        `;
    } else {
        datasheetBtnHtml = `
            <a href="../contacto.html" class="btn btn-secondary" style="flex: 1; justify-content: center; min-width: 200px;">
                <i data-lucide="download" style="width: 20px; height: 20px; margin-right: 8px;"></i>
                Sol·licitar Fitxa Tècnica
            </a>
        `;
    }
    html = html.replace(/\{\{PRODUCT_DATASHEET_BTN_HTML\}\}/g, datasheetBtnHtml);

    // JSON-LD Product Schema
    const productJsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": p.nom_ca,
        "image": p.imatges.map(img => `https://www.esmotech.com/${img.src}`),
        "description": p.descripcio_curta_ca,
        "sku": p.ref_interna,
        "mpn": p.ref_proveidor || p.ref_interna,
        "brand": {
            "@type": "Brand",
            "name": p.marca
        },
        "offers": {
            "@type": "Offer",
            "url": `https://www.esmotech.com/productes/${slug}.html`,
            "priceCurrency": "EUR",
            "price": "0.00",
            "priceValidUntil": "2026-12-31",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock"
        }
    };
    html = html.replace(/\{\{PRODUCT_JSON_LD\}\}/g, `<script type="application/ld+json">${JSON.stringify(productJsonLd, null, 2)}</script>`);
    
    let specsHtml = '';
    const addSpec = (label, value, icon) => {
        if (value && value !== '-') {
            specsHtml += `
                <li style="display: flex; align-items: flex-start; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color); margin-bottom: 1rem;">
                    <i data-lucide="${icon}" class="text-primary" style="width: 24px; flex-shrink: 0;"></i>
                    <div>
                        <span class="text-muted text-sm uppercase" style="display: block; margin-bottom: 0.25rem;">${label}</span>
                        <strong style="font-size: 1.1rem; color: var(--text-primary);">${value}</strong>
                    </div>
                </li>
            `;
        }
    };
    addSpec('Família Pare', p.nom_familia_pare, 'folder');
    addSpec('Categoria', categoryNames[p.categoria_id], categoryIcons[p.categoria_id] || 'box');
    addSpec('Màquines Compatibles', p.maquines_compatibles, 'cpu');
    addSpec('Material / Aliatge', p.material, 'layers');
    addSpec('Dimensions (mm)', p.dimensions, 'ruler');
    addSpec('Recobriment', p.recobriment, 'shield');
    addSpec('Aplicació / Sector', p.aplicacio, 'target');
    
    html = html.replace(/\{\{PRODUCT_SPECS\}\}/g, specsHtml);
    
    
        html = html.replace(/href="catalogo.html"/g, 'href="../catalogo.html"');
    html = html.replace(/href="productos.html"/g, 'href="../productos.html"');
    html = html.replace(/href="contacto.html"/g, 'href="../contacto.html"');
    html = html.replace(/href="cerca.html"/g, 'href="../cerca.html"');
    html = html.replace(/href="serveis\//g, 'href="../serveis/');
    html = html.replace(/href="pdf\//g, 'href="../pdf/');
    html = html.replace(/action="cerca.html"/g, 'action="../cerca.html"');
    fs.writeFileSync(path.join(distProdDir, `${slug}.html`), html);
    fs.writeFileSync(path.join(rootProdDir, `${slug}.html`), html);
});

// Copy custom category landing pages to dist/productes/
const customCatPages = ['eines-de-tall.html', 'serra-cinta.html', 'ganivetes-denvasat.html', 'circulars-i-evolutives.html', 'capcals-termics.html', 'abrasius.html'];
customCatPages.forEach(cp => {
    const srcPath = path.join(rootProdDir, cp);
    if (fs.existsSync(srcPath)) {
        fs.writeFileSync(path.join(distProdDir, cp), fs.readFileSync(srcPath, 'utf-8'));
    }
});

// Update sitemap.xml
let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
sitemapUrls.forEach(url => {
    sitemapContent += `  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
});
sitemapContent += `</urlset>`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent);

console.log('✅ Renomenament SEO Automàtic d\'Imatges i Etiquetes ALT Implementat!');
