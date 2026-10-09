import re

path = r"C:\Users\Albert\Desktop\Antigravity\esmotech\web-project\brand-book.html"
with open(path, "r", encoding="utf-8") as f:
    html = f.read()

# Replace Logo Section
new_logo_section = """<!-- 2. LOGO SYSTEM -->
                    <div id="logo-section" class="brand-section">
                        <h2 class="font-display text-heading-2 text-accent" style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">2. El Logotip Oficial</h2>
                        <p class="text-muted" style="margin-bottom: 1.5rem;">El logotip oficial d'ESMOTECH es compon del símbol icònic de tres barres de tall a l'esquerra (amb la franja central en <strong>blau elèctric corporatiu #0088FF</strong>), la tipografia massissa d'alta precisió <strong>ESMOTECH</strong>, la fulla de serra dentada sota <em>ESMO</em> i el subtítol d'especialització <strong>CUTTING SOLUTIONS</strong> sota <em>TECH</em>.</p>
                        
                        <div class="comparison-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                            <div>
                                <h4 class="font-display" style="margin-bottom: 0.5rem;">Sobre Fons Fosc (Predeterminat)</h4>
                                <div class="logo-box" style="background: #080D14; border: 1px solid #1E2D3D; border-radius: 8px; padding: 2rem; display: flex; align-items: center; justify-content: center; min-height: 120px;">
                                    <img src="img/esmotech-logo-white.png" alt="Esmotech Logo Blanc" style="height: 48px; max-width: 100%;">
                                </div>
                            </div>
                            <div>
                                <h4 class="font-display" style="margin-bottom: 0.5rem;">Sobre Fons Clar (Dossier i Paper)</h4>
                                <div class="logo-box light" style="background: #F8F9FA; border: 1px solid #E2E8F0; border-radius: 8px; padding: 2rem; display: flex; align-items: center; justify-content: center; min-height: 120px;">
                                    <img src="img/esmotech-logo-dark.png" alt="Esmotech Logo Negre" style="height: 48px; max-width: 100%;">
                                </div>
                            </div>
                            <div>
                                <h4 class="font-display" style="margin-bottom: 0.5rem;">Símbol &amp; Favicon (Icona de Marca)</h4>
                                <div class="logo-box" style="background: #121A26; border: 1px solid #1E2D3D; border-radius: 8px; padding: 2rem; display: flex; align-items: center; justify-content: center; min-height: 120px;">
                                    <img src="img/esmotech-icon-512.png" alt="Esmotech Símbol" style="height: 60px; width: 60px;">
                                </div>
                            </div>
                        </div>
                        
                        <h3 class="font-display text-heading-3" style="margin-top: 2rem; margin-bottom: 1rem;">Normes d'Aplicació</h3>
                        <div class="comparison-grid">
                            <div class="comp-card correct">
                                <h4 class="font-display" style="color: var(--success); margin-bottom: 0.5rem;"><i data-lucide="check-circle" style="width: 16px; vertical-align: middle;"></i> Usos Correctes</h4>
                                <ul style="list-style: square; padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.4rem;">
                                    <li>Mantenir sempre l'espai de seguretat equivalent a l'alçada de les barres del símbol.</li>
                                    <li>Utilitzar sempre la versió en alta resolució transparent sense requadres blancs postissos.</li>
                                    <li>Fer servir la versió blanca (<code>esmotech-logo-white.png</code>) sobre fons foscos i la versió negra (<code>esmotech-logo-dark.png</code>) sobre fons clars (#F8F9FA, documents impresos o catàlegs).</li>
                                </ul>
                            </div>
                            <div class="comp-card incorrect">
                                <h4 class="font-display" style="color: var(--error); margin-bottom: 0.5rem;"><i data-lucide="x-circle" style="width: 16px; vertical-align: middle;"></i> Usos Incorrectes</h4>
                                <ul style="list-style: square; padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.4rem;">
                                    <li>No estirar, aplanar o deformar les proporcions del logotip.</li>
                                    <li>No canviar el blau elèctric oficial (#0088FF) per altres colors aliens a la marca.</li>
                                    <li>No aplicar filtres d'inversió cromàtica CSS globals que alterin el color blau del símbol.</li>
                                </ul>
                            </div>
                        </div>
                    </div>"""

# Replace Color Section
new_color_section = """<!-- 3. COLOR SYSTEM -->
                    <div id="colors" class="brand-section">
                        <h2 class="font-display text-heading-2 text-accent" style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">3. Paleta de Colors Oficial</h2>
                        <p class="text-muted" style="margin-bottom: 1rem;">Fes clic a qualsevol targeta de color per copiar el codi HEX directament al porta-retalls.</p>
                        
                        <div class="color-palette-grid">
                            <div class="color-card" onclick="copyColor('#0088FF', 'Blau Elèctric Esmotech')">
                                <div class="color-swatch" style="background: #0088FF; box-shadow: inset 0 0 10px rgba(0,0,0,0.2);"></div>
                                <div class="color-info">
                                    <div class="color-name">Blau Elèctric (Accent)</div>
                                    <div class="color-hex">#0088FF <i data-lucide="copy" style="width: 14px;"></i></div>
                                </div>
                            </div>
                            
                            <div class="color-card" onclick="copyColor('#080D14', 'Negre Marí Industrial')">
                                <div class="color-swatch" style="background: #080D14;"></div>
                                <div class="color-info">
                                    <div class="color-name">Negre Marí Fosc</div>
                                    <div class="color-hex">#080D14 <i data-lucide="copy" style="width: 14px;"></i></div>
                                </div>
                            </div>
                            
                            <div class="color-card" onclick="copyColor('#64748B', 'Gris Acer Oficial')">
                                <div class="color-swatch" style="background: #64748B;"></div>
                                <div class="color-info">
                                    <div class="color-name">Gris Acer (Dossier)</div>
                                    <div class="color-hex">#64748B <i data-lucide="copy" style="width: 14px;"></i></div>
                                </div>
                            </div>
                            
                            <div class="color-card" onclick="copyColor('#F8F9FA', 'Fons Clar Dossier')">
                                <div class="color-swatch" style="background: #F8F9FA; border-bottom: 1px solid var(--border-color);"></div>
                                <div class="color-info">
                                    <div class="color-name">Blanc Dossier</div>
                                    <div class="color-hex">#F8F9FA <i data-lucide="copy" style="width: 14px;"></i></div>
                                </div>
                            </div>

                            <div class="color-card" onclick="copyColor('#38BDF8', 'Cian Precisió')">
                                <div class="color-swatch" style="background: #38BDF8;"></div>
                                <div class="color-info">
                                    <div class="color-name">Cian / Hover</div>
                                    <div class="color-hex">#38BDF8 <i data-lucide="copy" style="width: 14px;"></i></div>
                                </div>
                            </div>
                        </div>
                        
                        <h3 class="font-display text-heading-3" style="margin-top: 2rem; margin-bottom: 1rem;">Directrius d'ús del color</h3>
                        <div style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--border-radius-md); border: 1px solid var(--border-color);">
                            <p class="text-sm text-secondary-color" style="line-height: 1.6; margin-bottom: 0.8rem;">
                                <strong>Blau Elèctric (#0088FF)</strong>: És el color d'accent clau de la marca ESMOTECH, que extreu la seva força de la línia central del símbol corporatiu i del dossier comercial. S'aplica a botons primaris, badges destacats, elements de focus visual i indicadors d'estat tècnic.
                            </p>
                            <p class="text-sm text-secondary-color" style="line-height: 1.6;">
                                <strong>Contrast i Higiene Industrial</strong>: El contrast entre el negre fosc industrial (#080D14) o el blanc pur (#FFFFFF / #F8F9FA) garanteix la màxima llegibilitat (<strong>WCAG AAA</strong>) transmetent netedat sanitària i rigor tecnològic.
                            </p>
                        </div>
                    </div>"""

# Replace Code snippet
new_code_section = """/* Patró Gràfic ESMOTECH Oficial - Blau Elèctric & Precisió Industrial */
:root {
  /* Fons Tècnic d'Alta Precisió */
  --bg-primary:    #080D14;  /* Fons principal marí fosc */
  --bg-secondary:  #0F1722;  /* Panells i seccions */
  --bg-tertiary:   #16202E;  /* Targetes i elements interactius */
  
  /* Paleta Corporativa Oficial (Blau Elèctric) */
  --primary:        #0088FF;  /* Blau corporatiu oficial */
  --primary-light:  #38BDF8;  /* Cian / hover */
  --primary-dark:   #0066CC;  /* Blau fosc actiu */
  --primary-muted:  rgba(0, 136, 255, 0.12); /* Blau translúcid per a badges */
  --primary-glow:   rgba(0, 136, 255, 0.35); /* Resplendor tècnic */
  
  /* Escala Neutral */
  --text-primary:  #F8FAFC;  /* Blanc d'alt contrast */
  --text-secondary:#94A3B8;  /* Gris blavós metàl·lic */
  --text-muted:    #64748B;  /* Gris acer oficial dossier */
  --border-color:  #1E2D3D;  /* Vora de taules i caixes */
  
  /* Fonts Corporatives */
  --font-display: 'Barlow Condensed', sans-serif;
  --font-body:    'Inter', sans-serif;
}"""

html = re.sub(r'<!-- 2\. LOGO SYSTEM -->.*?<!-- 3\. COLOR SYSTEM -->', new_logo_section + '\n\n                    ', html, flags=re.DOTALL)
html = re.sub(r'<!-- 3\. COLOR SYSTEM -->.*?<!-- 4\. TYPOGRAPHY -->', new_color_section + '\n\n                    <!-- 4. TYPOGRAPHY -->', html, flags=re.DOTALL)
html = re.sub(r'/\* Patró Gràfic ESMOTECH - Disseny Fosc Premium \*/.*?}</pre>', new_code_section + '</pre>', html, flags=re.DOTALL)

with open(path, "w", encoding="utf-8") as f:
    f.write(html)

print("Updated brand-book.html successfully!")
