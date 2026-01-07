import { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);
  const { sendMessage, isSoundEnabled } = useChatStore();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    // 1. Padding changed to px-4 py-3 to look better on phones
    <div className="w-full px-4 py-3 border-t border-slate-800/50">
      
      {/* --- IMAGE PREVIEW --- */}
      {imagePreview && (
        <div className="mb-3 flex items-center">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-slate-700 shadow-lg"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white hover:bg-rose-600 transition-colors shadow-md"
              type="button"
            >
              <XIcon className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* --- FORM --- */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2">
          
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          {/* TEXT INPUT */}
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              isSoundEnabled && playRandomKeyStrokeSound();
            }}
            className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-2 px-4 text-sm sm:text-base text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-500"
            placeholder="Message..."
          />
        </div>

        {/* IMAGE ATTACH BUTTON */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`flex-shrink-0 p-2 rounded-full transition-all ${
              imagePreview ? "text-cyan-400 bg-cyan-500/10" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ImageIcon className="size-5 sm:size-6" />
          </button>

        {/* SEND BUTTON */}
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className={`flex-shrink-0 size-10 flex items-center justify-center rounded-full transition-all shadow-lg ${
            !text.trim() && !imagePreview
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-cyan-500 text-white hover:bg-cyan-600 active:scale-90"
          }`}
        >
          <SendIcon className="size-5" />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;