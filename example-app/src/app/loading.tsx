const Loading=() => {
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center backdrop-blur-xl bg-white/50 dark:bg-black/50">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
};

export default Loading;