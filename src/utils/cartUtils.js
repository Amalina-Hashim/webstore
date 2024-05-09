export const updateCartItemCount = (setCartItemCount, updateImmediately) => {
  const handleStorageChange = () => {
    console.log("Storage change detected");
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      const itemCount = parseInt(storedCartItems);
      console.log("Updated cart item count:", itemCount);
      setCartItemCount(itemCount);
    } else {
      console.log("Cart items not found in storage");
      setCartItemCount(0);
    }
  };

  window.addEventListener("storage", handleStorageChange);

  handleStorageChange();

  if (updateImmediately) {
    const storedCartItems = localStorage.getItem("cartItems");
    const itemCount = parseInt(storedCartItems) + 1;
    setCartItemCount(itemCount);
  }

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
};
