import imageCompression from 'browser-image-compression';

// Web Worker for async image compression
self.onmessage = async (e: MessageEvent<{ file: File }>) => {
  try {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: false, // Already in worker, no need for nested worker
    };

    const compressedFile = await imageCompression(e.data.file, options);
    
    self.postMessage({ 
      success: true, 
      file: compressedFile 
    });
  } catch (error) {
    self.postMessage({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Compression failed'
    });
  }
};
