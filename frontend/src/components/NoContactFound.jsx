import { useChatStore } from "../store/useChatStore";

function NoContactFound() {
  const { setActiveTab } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center">
        <img src="/logo.png" className="mx-auto text-slate-400 mb-2" />
      </div>
      <div>
        <h4 className="text-slate-200 font-medium mb-1">No contacts yet</h4>
        <p className="text-slate-400 text-sm px-6">
            Start adding contacts to see them listed here
        </p>
      </div>
    </div>
  );
}
export default NoContactFound;