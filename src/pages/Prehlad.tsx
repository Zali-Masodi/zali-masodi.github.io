import { Link } from "react-router-dom";
import "./Prehlad.css";

interface LinkItem {
  label: string;
  href: string;
  description?: string;
}

const LINKS: LinkItem[] = [
  { label: "Pekaren", href: "/pekaren", description: "Stranka pre pekaren"},
  { label: "Dodavka", href: "/dodavka", description: "Stranka pre dodavku"},
  { label: "Stavba", href: "/stavba", description: "Stranka pre stavbu"}
];

export default function LinksPage() {
  return (
    <div className="links-page">
      <header className="links-header">
        <span className="links-eyebrow">Directory</span>
        <h1 className="links-title">Where to next</h1>
      </header>

      <ol className="links-list">
        {LINKS.map((item, i) => (
          <li className="links-item" key={item.href}>
            <Link className="links-anchor" to={item.href}>
              <span className="links-index">{String(i + 1).padStart(2, "0")}</span>
              <span className="links-text">
                <span className="links-label">{item.label}</span>
                {item.description && (
                  <span className="links-description">{item.description}</span>
                )}
              </span>
              <span className="links-arrow" aria-hidden="true">&#8594;</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}