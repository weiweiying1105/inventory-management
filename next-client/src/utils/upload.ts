
export const uploadImage = async (file: File): Promise<string> => {
  const formatData = new FormData();
  formatData.append('image', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formatData,
    });
  }
} 