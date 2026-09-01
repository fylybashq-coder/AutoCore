function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-[fadeIn_.2s_ease]">

        <div className="flex items-center justify-between border-b px-6 py-4">

          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-red-600"
          >
            ✕
          </button>

        </div>

        <div className="p-6">
          {children}
        </div>

      </div>

    </div>
  );
}

export default Modal;