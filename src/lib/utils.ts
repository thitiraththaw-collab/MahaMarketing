export function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: any): string {
  if (!date) return '-';
  
  let d: Date;
  if (typeof date === 'string') {
    d = new Date(date);
  } else if (date.toDate && typeof date.toDate === 'function') {
    d = date.toDate();
  } else if (date.seconds) {
    d = new Date(date.seconds * 1000);
  } else {
    d = new Date(date);
  }

  if (isNaN(d.getTime())) return '-';
  
  return d.toLocaleDateString('th-TH', { dateStyle: 'long' });
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
