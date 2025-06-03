import React, { useState, useEffect, useRef } from "react";
import "@google/model-viewer";
import "./Model3D.css";
import FormularioVerificacion from "./FormularioVerificacion";
import Publicaciones from "./Publicaciones";

const Model3D = ({ modelPath }) => {
  const [color, setColor] = useState("#ffffff");
  const [stickers, setStickers] = useState([]);
  const [texts, setTexts] = useState([]);
  const [newText, setNewText] = useState("");
  const [editingTextId, setEditingTextId] = useState(null);
  const [showFormulario, setShowFormulario] = useState(false);
  const [showPublicaciones, setShowPublicaciones] = useState(false);
  const [mode, setMode] = useState("view");
  const [pendingSticker, setPendingSticker] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentDraggingId, setCurrentDraggingId] = useState(null);
  const [textBackground, setTextBackground] = useState(true);
  const modelRef = useRef(null);
  const stickerRefs = useRef({});

  useEffect(() => {
    const modelViewer = modelRef.current;
    const applyColor = () => {
      const hex = color;
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      const material = modelViewer?.model?.materials?.[0];
      if (material?.pbrMetallicRoughness) {
        material.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1]);
      }
    };

    if (modelViewer?.model) {
      applyColor();
    } else {
      modelViewer?.addEventListener("load", applyColor);
    }
  }, [color]);

  const handleModelClick = (event) => {
    if (mode === "view" && !isDragging) return;
    
    const modelViewer = modelRef.current;
    if (!modelViewer) return;

    const rect = modelViewer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const hit = modelViewer.positionAndNormalFromPoint(x, y);
    
    if (!hit) return;

    const position = `${hit.position.x.toFixed(2)}m ${hit.position.y.toFixed(2)}m ${hit.position.z.toFixed(2)}m`;
    const normal = `${hit.normal.x.toFixed(2)}m ${hit.normal.y.toFixed(2)}m ${hit.normal.z.toFixed(2)}m`;

    if (mode === "addSticker" && pendingSticker) {
      const id = Date.now();
      setStickers((prev) => [
        ...prev,
        {
          id,
          name: pendingSticker.name,
          url: pendingSticker.url,
          position,
          normal,
          scale: 1,
          rotation: 0,
        },
      ]);
      setPendingSticker(null);
      setMode("view");
    } else if (mode === "addText" && newText.trim()) {
      const id = Date.now();
      setTexts((prev) => [
        ...prev,
        {
          id,
          content: newText,
          position,
          normal,
          color: "#000000",
          fontSize: 20,
          fontFamily: "Arial",
        },
      ]);
      setNewText("");
      setEditingTextId(id);
      setMode("view");
    } else if (isDragging && currentDraggingId) {
      setStickers(prev => prev.map(sticker => 
        sticker.id === currentDraggingId ? { ...sticker, position, normal } : sticker
      ));
    }
  };

  const startDragging = (id, event) => {
    event.stopPropagation();
    setIsDragging(true);
    setCurrentDraggingId(id);
    
    const stickerElement = stickerRefs.current[id];
    if (stickerElement) {
      const rect = stickerElement.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
    }
  };

  const stopDragging = () => {
    setIsDragging(false);
    setCurrentDraggingId(null);
  };

  const handleMouseMove = (event) => {
    if (isDragging && currentDraggingId) {
      handleModelClick(event);
    }
  };

  const rotateSticker = (id, direction) => {
    setStickers(prev => prev.map(sticker => 
      sticker.id === id ? { 
        ...sticker, 
        rotation: (sticker.rotation + (direction === 'right' ? 15 : -15)) % 360 
      } : sticker
    ));
  };

  const handleStickerUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPendingSticker({
        name: file.name,
        url: url,
      });
      setMode("addSticker");
    }
  };

  const handleAddText = () => {
    if (newText.trim() === "") return;
    setMode("addText");
  };

  const updateTextProperty = (id, key, value) => {
    setTexts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [key]: value } : t))
    );
  };

  const moveOverlay = (setFunc, id, direction) => {
    setFunc((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const [x, y, z] = item.position.split("m ").map(parseFloat);
        const delta = 0.05;
        
        switch (direction) {
          case "up":
            return { ...item, position: `${x}m ${y}m ${(z + delta).toFixed(2)}m` };
          case "down":
            return { ...item, position: `${x}m ${y}m ${(z - delta).toFixed(2)}m` };
          case "left":
            return { ...item, position: `${(x - delta).toFixed(2)}m ${y}m ${z}m` };
          case "right":
            return { ...item, position: `${(x + delta).toFixed(2)}m ${y}m ${z}m` };
          default:
            return item;
        }
      })
    );
  };

  const resizeSticker = (id, type) => {
    setStickers((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, scale: type === "increase" ? s.scale * 1.1 : s.scale * 0.9 }
          : s
      )
    );
  };

  const removeSticker = (id) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
  };

  const removeText = (id) => {
    setTexts((prev) => prev.filter((t) => t.id !== id));
    setEditingTextId(null);
  };

  const cancelMode = () => {
    setMode("view");
    setPendingSticker(null);
  };

  const handlePublicarDiseno = () => {
    setShowFormulario(true);
  };

  const handleFormularioSubmit = (datos) => {
    console.log("Datos del formulario:", datos);
    console.log("Diseño:", { color, stickers, texts });
    setShowFormulario(false);
  };

  const handleFormularioCancel = () => {
    setShowFormulario(false);
  };

  if (showFormulario) {
    return (
      <FormularioVerificacion
        onSubmit={handleFormularioSubmit}
        onCancel={handleFormularioCancel}
        disenoData={{ color, stickers, texts }}
      />
    );
  }

  if (showPublicaciones) {
    return <Publicaciones onBack={() => setShowPublicaciones(false)} />;
  }

  return (
    <div className="model-wrapper" 
         onMouseUp={stopDragging}
         onMouseLeave={stopDragging}
         onMouseMove={handleMouseMove}>
      <header className="header">
        <img src="/AliS.png" alt="AliS Logo" className="logo" />
        <nav className="nav">
          <a href="/">Inicio</a>
          <a href="/viewer/polera">Diseñador 3D</a>
          <button 
            onClick={() => setShowPublicaciones(true)}
            className="nav-button"
          >
            Ver Publicaciones
          </button>
          <select
            onChange={(e) => (window.location.href = `/viewer/${e.target.value}`)}
            className="model-selector"
          >
            <option value="polera">Polera</option>
            <option value="top">Top</option>
            <option value="canguro">Canguro</option>
            <option value="gorra">Gorra</option>
          </select>
        </nav>
      </header>

      {mode !== "view" && (
        <div className="mode-instructions">
          <div className="instruction-content">
            <span>
              {mode === "addSticker" ? "Haz clic en el modelo donde quieras colocar la imagen" : 
               mode === "addText" ? "Haz clic en el modelo donde quieras colocar el texto" : ""}
            </span>
            <button onClick={cancelMode} className="cancel-button">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="model-body">
        <div className="model-viewer-container">
          <model-viewer
            ref={modelRef}
            src={modelPath}
            alt="Modelo 3D"
            auto-rotate
            camera-controls
            ar
            exposure="1"
            onClick={handleModelClick}
            style={{ 
              width: "100%", 
              height: "100%", 
              background: "transparent",
              cursor: mode !== "view" ? "crosshair" : isDragging ? "grabbing" : "grab"
            }}
          >
            {stickers.map((sticker, index) => (
              <div
                key={sticker.id}
                slot={`hotspot-${index}`}
                data-position={sticker.position}
                data-normal={sticker.normal}
                ref={el => stickerRefs.current[sticker.id] = el}
              >
                <img
                  src={sticker.url}
                  alt={sticker.name}
                  style={{
                    width: `${80 * sticker.scale}px`,
                    height: `${80 * sticker.scale}px`,
                    objectFit: "contain",
                    borderRadius: "8px",
                    background: "transparent",
                    transform: `rotate(${sticker.rotation}deg)`,
                    cursor: "move",
                    userSelect: "none"
                  }}
                  onMouseDown={(e) => startDragging(sticker.id, e)}
                  draggable="false"
                />
              </div>
            ))}
            {texts.map((text, index) => (
              <div
                key={text.id}
                slot={`hotspot-text-${index}`}
                data-position={text.position}
                data-normal={text.normal}
              >
                <span
                  style={{
                    color: text.color,
                    fontSize: `${text.fontSize}px`,
                    fontFamily: text.fontFamily,
                    background: textBackground ? "rgba(255,255,255,0.8)" : "transparent",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    boxShadow: textBackground ? "0 2px 4px rgba(0,0,0,0.2)" : "none",
                    display: "inline-block",
                  }}
                >
                  {text.content}
                </span>
              </div>
            ))}
          </model-viewer>
        </div>

        <aside className="control-panel">
          <h2>Personaliza tu prenda</h2>

          <div className="control-group">
            <label>Color de prenda:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className="control-group">
            <label>Agregar imagen:</label>
            <input type="file" accept="image/*" onChange={handleStickerUpload} />
            {mode === "addSticker" && (
              <p className="mode-hint">
                Haz clic en el modelo para colocar la imagen....
              </p>
            )}
          </div>

          {stickers.map((sticker) => (
            <div key={sticker.id} className="sticker-controls">
              <h3>{sticker.name}</h3>
              <div className="control-buttons">
                <button onClick={() => moveOverlay(setStickers, sticker.id, "up")}>⬆</button>
                <button onClick={() => moveOverlay(setStickers, sticker.id, "down")}>⬇</button>
                <button onClick={() => moveOverlay(setStickers, sticker.id, "left")}>⬅</button>
                <button onClick={() => moveOverlay(setStickers, sticker.id, "right")}>➡</button>
                <button onClick={() => resizeSticker(sticker.id, "increase")}>➕</button>
                <button onClick={() => resizeSticker(sticker.id, "decrease")}>➖</button>
                <button onClick={() => rotateSticker(sticker.id, 'left')}>↺</button>
                <button onClick={() => rotateSticker(sticker.id, 'right')}>↻</button>
                <button onClick={() => removeSticker(sticker.id)} className="remove-button">Quitar</button>
              </div>
              <p className="drag-hint">Arrastra la imagen en el modelo para reposicionarla</p>
            </div>
          ))}

          <div className="control-group">
            <label>Agregar texto:</label>
            <input
              type="text"
              placeholder="Nombre o número"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
            <button onClick={handleAddText} disabled={!newText.trim()}>
              Agregar texto
            </button>
            {mode === "addText" && (
              <p className="mode-hint">
                ✨ Haz clic en el modelo para colocar el texto
              </p>
            )}
          </div>

          {texts.map((text) =>
            text.id === editingTextId ? (
              <div key={text.id} className="text-controls">
                <h3>Editando: "{text.content}"</h3>
                
                <label>
                  <input
                    type="checkbox"
                    checked={textBackground}
                    onChange={(e) => setTextBackground(e.target.checked)}
                  />
                  Fondo del texto
                </label>
                
                <label>Color del texto:</label>
                <input
                  type="color"
                  value={text.color}
                  onChange={(e) => updateTextProperty(text.id, "color", e.target.value)}
                />
                
                <label>Tamaño:</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={text.fontSize}
                  onChange={(e) => updateTextProperty(text.id, "fontSize", e.target.value)}
                />
                <span className="size-display">{text.fontSize}px</span>
                
                <label>Tipografía:</label>
                <select
                  value={text.fontFamily}
                  onChange={(e) => updateTextProperty(text.id, "fontFamily", e.target.value)}
                >
                  <option value="Arial">Arial</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Courier New">Courier</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Impact">Impact</option>
                </select>
                
                <label>Ubicación:</label>
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    let position, normal;
                    switch (value) {
                      case "frente":
                        position = "0m 0m 0.1m";
                        normal = "0m 0m 1m";
                        break;
                      case "atras":
                        position = "0m 0m -0.1m";
                        normal = "0m 0m -1m";
                        break;
                      case "manga izquierda":
                        position = "-0.3m 0m 0m";
                        normal = "-1m 0m 0m";
                        break;
                      case "manga derecha":
                        position = "0.3m 0m 0m";
                        normal = "1m 0m 0m";
                        break;
                    }
                    updateTextProperty(text.id, "position", position);
                    updateTextProperty(text.id, "normal", normal);
                  }}
                >
                  <option>frente</option>
                  <option>atras</option>
                  <option>manga izquierda</option>
                  <option>manga derecha</option>
                </select>

                <div className="control-buttons">
                  <button onClick={() => moveOverlay(setTexts, text.id, "up")}>⬆</button>
                  <button onClick={() => moveOverlay(setTexts, text.id, "down")}>⬇</button>
                  <button onClick={() => moveOverlay(setTexts, text.id, "left")}>⬅</button>
                  <button onClick={() => moveOverlay(setTexts, text.id, "right")}>➡</button>
                </div>

                <div className="text-action-buttons">
                  <button onClick={() => setEditingTextId(null)} className="finish-button">
                    Terminar edición
                  </button>
                  <button onClick={() => removeText(text.id)} className="remove-button">
                    Quitar texto
                  </button>
                </div>
              </div>
            ) : (
              <div key={text.id} className="text-item">
                <span>"{text.content}"</span>
                <button onClick={() => setEditingTextId(text.id)} className="edit-button">
                  Editar
                </button>
              </div>
            )
          )}

          <div className="publish-section">
            <button 
              onClick={handlePublicarDiseno}
              className="publish-button"
            >
              PUBLICA TU DISEÑO
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Model3D;