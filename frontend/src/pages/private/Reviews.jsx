import { useState, useEffect } from "react";

const Reviews = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      try {
        setReviews([
          "Aplikasi sangat membantu dan mudah digunakan",
          "Tampilan dashboard bagus",
          "Performa cukup cepat",
        ]);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div>
        <h1>Reviews Page</h1>
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Reviews Page</h1>
        <p>Gagal memuat data reviews.</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div>
        <h1>Reviews Page</h1>
        <p>Belum ada ulasan pengguna.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Reviews Page</h1>
      <p>Halaman ulasan pengguna</p>

      <ul>
        {reviews.map((review, index) => (
          <li key={index}>{review}</li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;
