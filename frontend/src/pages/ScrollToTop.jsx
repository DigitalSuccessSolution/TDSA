import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Only scroll to top if no hash is present
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null; // Ye component kuch render नहीं करता, sirf effect handle करता है
};

export default ScrollToTop;
