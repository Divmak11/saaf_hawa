// Mock data for Saaf Hawa Abhiyan petition website

export const mockPetitionData = {
  totalSignatures: 12847,
  recentSignatures: [
    { name: "Priya Sharma", timestamp: "2 minutes ago" },
    { name: "Rajesh Kumar", timestamp: "5 minutes ago" },
    { name: "Anjali Verma", timestamp: "8 minutes ago" },
    { name: "Vikram Singh", timestamp: "12 minutes ago" },
    { name: "Meera Patel", timestamp: "15 minutes ago" }
  ]
};

export const mockSubmitSignature = async (formData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Store in localStorage for demo
  const signature = {
    ...formData,
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toISOString(),
    signatureNumber: mockPetitionData.totalSignatures + 1
  };
  
  localStorage.setItem('userSignature', JSON.stringify(signature));
  
  return signature;
};

export const getUserSignature = () => {
  const stored = localStorage.getItem('userSignature');
  return stored ? JSON.parse(stored) : null;
};