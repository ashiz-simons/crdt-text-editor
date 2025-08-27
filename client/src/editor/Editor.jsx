import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

function getRandomColor() {
  const colors = ["#D32F2F", "#1976D2", "#388E3C", "#F57C00", "#7B1FA2", "#0097A7"];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default function Editor() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const username = searchParams.get("username") || "Anonymous";
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [editorState, setEditorState] = useState(0);
  const [users, setUsers] = useState([]); // 🔥 track connected users

  const { ydoc, provider, yXmlFragment } = useMemo(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider("ws://localhost:1234", roomId, ydoc);
    const yXmlFragment = ydoc.getXmlFragment("prosemirror");
    return { ydoc, provider, yXmlFragment };
  }, [roomId]);

  useEffect(() => {
    provider.awareness.setLocalStateField("user", {
      name: username,
      color: getRandomColor(),
    });

    // 🔥 Listen for awareness changes (when users join/leave)
    const awarenessListener = () => {
      const states = Array.from(provider.awareness.getStates().values());
      setUsers(states.map((s) => s.user));
    };

    provider.awareness.on("change", awarenessListener);
    return () => provider.awareness.off("change", awarenessListener);
  }, [provider, username]);

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color, Highlight],
    content: "<p>Start typing with your friends 🚀</p>",
  });

  useEffect(() => {
    if (!editor) return;
    const updateHandler = () => setEditorState((s) => s + 1);
    editor.on("transaction", updateHandler);
    return () => editor.off("transaction", updateHandler);
  }, [editor]);

  useEffect(() => {
    if (editor) {
      import("y-prosemirror").then(({ ySyncPlugin, yCursorPlugin, yUndoPlugin }) => {
        editor.registerPlugin(ySyncPlugin(yXmlFragment));
        editor.registerPlugin(yCursorPlugin(provider.awareness));
        editor.registerPlugin(yUndoPlugin());
      });
    }
  }, [editor, provider, yXmlFragment]);

  useEffect(() => {
    const loadDoc = async () => {
      const docSnap = await getDoc(doc(db, "documents", roomId));
      if (docSnap.exists()) {
        editor?.commands.setContent(docSnap.data().content);
      }
    };
    loadDoc();
  }, [editor, roomId]);

  useEffect(() => {
    if (!editor) return;
    const interval = setInterval(async () => {
      const json = editor.getJSON();
      await setDoc(doc(db, "documents", roomId), { content: json });
    }, 5000);

    return () => clearInterval(interval);
  }, [editor, roomId]);

  const exportPDF = () => {
    if (!editor) return;
    const docPDF = new jsPDF();
    docPDF.text(editor.getText(), 10, 10);
    docPDF.save("document.pdf");
  };

  const leaveRoom = () => {
    provider.disconnect();
    navigate("/");
  };

  return (
    <div className="editor-container">
      {/* Sticky Toolbar */}
      <div className="toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`toolbar-btn ${editor?.isActive("bold") ? "active" : ""}`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`toolbar-btn ${editor?.isActive("italic") ? "active" : ""}`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`toolbar-btn ${editor?.isActive("highlight") ? "active" : ""}`}
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
        <button
          onClick={exportPDF}
          className="toolbar-btn export-btn ml-auto"
        >
          Export PDF
        </button>

        {/* 🔥 User Counter */}
        <div className="user-counter ml-4">
          👥 {users.length} {users.length === 1 ? "user" : "users"} online
        </div>
      </div>

      {/* Editor area scrolls with page */}
      <div className="editor-wrapper p-4">
        <EditorContent editor={editor} className="editor prose max-w-none" />
      </div>

      {/* Fixed Leave Button */}
      <button onClick={leaveRoom} className="leaveroom fixed bottom-4 right-4">
        Leave Room
      </button>
    </div>
  );
}
