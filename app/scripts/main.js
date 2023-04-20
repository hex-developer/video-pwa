const form = document.querySelector('form');
const fileInput = document.querySelector('#video');
const videoContainer = document.querySelector('#player');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  windows.alert("uploaded")
  const file = fileInput.files[0];

  // Use the File API to read the contents of the file
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = () => {
    // Store the file in the browser's indexedDB
    const db = window.indexedDB.open('videos');
    db.onsuccess = (event) => {
      const database = event.target.result;
      const transaction = database.transaction('videos', 'readwrite');
      const store = transaction.objectStore('videos');

      const video = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: reader.result
      };

      store.add(video);
      window.alert('video added')
    };
  };
});

// Load and play the uploaded video
const db = window.indexedDB.open('videos');
db.onsuccess = (event) => {
  const database = event.target.result;
  const transaction = database.transaction('videos', 'readonly');
  const store = transaction.objectStore('videos');

  store.get(1).onsuccess = (event) => {
    const video = event.target.result;
    const blob = new Blob([video.data], { type: video.type });
    const url = URL.createObjectURL(blob);

    videoContainer.src = url;
    window.alert("video loaded")
    window.alert(url)
  };
};
