<div className="toolbar">
  <button
    onClick={() => editor.chain().focus().toggleBold().run()}
    className={`toolbar-btn ${editor.isActive("bold") ? "active" : ""}`}
  >
    Bold
  </button>

  <button
    onClick={() => editor.chain().focus().toggleItalic().run()}
    className={`toolbar-btn ${editor.isActive("italic") ? "active" : ""}`}
  >
    Italic
  </button>

  <button
    onClick={() => editor.chain().focus().toggleHighlight().run()}
    className={`toolbar-btn ${editor.isActive("highlight") ? "active" : ""}`}
  >
    Highlight
  </button>

  <input
    type="color"
    value={selectedColor}
    onChange={(e) => {
      setSelectedColor(e.target.value);
      editor.chain().focus().setColor(e.target.value).run();
    }}
    className="color-picker"
  />

  <button
    onClick={() => editor.chain().focus().unsetColor().run()}
    className="toolbar-btn"
  >
    Clear Color
  </button>

  <button onClick={exportPDF} className="toolbar-btn ml-auto">
    Export PDF
  </button>
</div>
