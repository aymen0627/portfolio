import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function App() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  
  // Create scroll-based transforms
  const firstNameScale = useTransform(scrollY, [0, 200], [1, 0.8]);
  const firstNameY = useTransform(scrollY, [0, 200], [0, -5]);
  const firstNameScaleY = useTransform(scrollY, [0, 200], [1, 0.8]);
  
  const lastNameScale = useTransform(scrollY, [0, 200], [1, 1.05]);
  const lastNameY = useTransform(scrollY, [0, 200], [0, -10]);
  const lastNameScaleY = useTransform(scrollY, [0, 200], [1, 1.1]);

  return (
    <div ref={containerRef}>
      <header className="header">
        <nav className="nav">
          <motion.div 
            className="logo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            AYMEN
          </motion.div>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h1 className="hero-title">
            <motion.span
              style={{ 
                scale: firstNameScale,
                y: firstNameY,
                scaleY: firstNameScaleY
              }}
              className="name-text"
            >
              AYMEN
            </motion.span>
            <motion.span
              style={{ 
                scale: lastNameScale,
                y: lastNameY,
                scaleY: lastNameScaleY
              }}
              className="name-text"
            >
              HASNAIN
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="hero-subtitle"
          >
            Available for opportunities
          </motion.p>
        </section>

        {/* Cards Section */}
        <motion.section className="cards-container">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              className="card"
              initial={{ scale: 0.95, y: index * 20 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              layoutId={`card-${card.id}`}
              onClick={() => setSelectedCard(card)}
            >
              <motion.img src={card.image} alt={card.title} />
              <motion.div className="card-content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.section>

        {/* Expanded Card View */}
        {selectedCard && (
          <motion.div
            layoutId={`card-${selectedCard.id}`}
            className="expanded-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Expanded card content */}
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App; 