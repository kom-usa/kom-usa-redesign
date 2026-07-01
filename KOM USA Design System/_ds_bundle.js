/* @ds-bundle: {"format":3,"namespace":"KOMUSADesignSystem_8f04d7","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Tag","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"ServiceCard","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/forms/FormFields.jsx"},{"name":"Select","sourcePath":"components/forms/FormFields.jsx"},{"name":"FormFields","sourcePath":"components/forms/FormFields.jsx"},{"name":"Checkbox","sourcePath":"components/forms/FormFields.jsx"},{"name":"NavBar","sourcePath":"components/navigation/SiteChrome.jsx"},{"name":"SiteChrome","sourcePath":"components/navigation/SiteChrome.jsx"},{"name":"Footer","sourcePath":"components/navigation/SiteChrome.jsx"},{"name":"AboutPage","sourcePath":"ui_kits/website/AboutPage.jsx"},{"name":"ContactPage","sourcePath":"ui_kits/website/ContactPage.jsx"},{"name":"HomePage","sourcePath":"ui_kits/website/HomePage.jsx"},{"name":"Logo","sourcePath":"ui_kits/website/Logo.jsx"},{"name":"Photo","sourcePath":"ui_kits/website/Photo.jsx"},{"name":"ServicesPage","sourcePath":"ui_kits/website/ServicesPage.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"e00a7d4a53d5","components/core/Button.jsx":"d7357eb8e07e","components/core/Card.jsx":"aacd6c27f526","components/forms/FormFields.jsx":"b69070e795b5","components/navigation/SiteChrome.jsx":"5cb0127bcb45","ui_kits/website/AboutPage.jsx":"cfe34e2eb6af","ui_kits/website/ContactPage.jsx":"f7b2a392f701","ui_kits/website/HomePage.jsx":"dac0c42845b3","ui_kits/website/Logo.jsx":"2e0b27650d7b","ui_kits/website/Photo.jsx":"6e5696e9aada","ui_kits/website/ServicesPage.jsx":"e40724cf3a4f"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.KOMUSADesignSystem_8f04d7 = window.KOMUSADesignSystem_8f04d7 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function Badge({
  tone = "neutral",
  children
}) {
  const tones = {
    neutral: {
      background: "var(--kom-concrete)",
      color: "var(--text-primary)"
    },
    green: {
      background: "var(--surface-accent-soft)",
      color: "var(--kom-green-dark)"
    },
    brass: {
      background: "rgba(197,154,66,0.14)",
      color: "#8a6c2e"
    },
    inverse: {
      background: "var(--kom-charcoal)",
      color: "var(--kom-white)"
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontFamily: "var(--font-main)",
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      padding: "4px 10px",
      borderRadius: "var(--radius-pill)",
      ...tones[tone]
    }
  }, children);
}
function Tag({
  children,
  onRemove
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontFamily: "var(--font-main)",
      fontWeight: 500,
      fontSize: 13,
      color: "var(--text-primary)",
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      padding: "4px 10px 4px 12px",
      borderRadius: "var(--radius-sm)"
    }
  }, children, onRemove && /*#__PURE__*/React.createElement("button", {
    onClick: onRemove,
    "aria-label": "Remove",
    style: {
      border: "none",
      background: "transparent",
      color: "var(--text-secondary)",
      cursor: "pointer",
      fontSize: 14,
      lineHeight: 1,
      padding: 0
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Badge, Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function Button({
  variant = "primary",
  size = "md",
  children,
  icon,
  disabled,
  onClick,
  type = "button"
}) {
  const base = {
    fontFamily: "var(--font-main)",
    fontWeight: 700,
    letterSpacing: "var(--letter-spacing-button)",
    borderRadius: "var(--radius-sm)",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: "1px solid transparent",
    transition: "background-color 120ms ease, border-color 120ms ease, color 120ms ease, transform 80ms ease",
    opacity: disabled ? 0.5 : 1
  };
  const sizes = {
    sm: {
      padding: "0.55rem 0.85rem",
      fontSize: 14
    },
    md: {
      padding: "0.85rem 1.1rem",
      fontSize: 15
    },
    lg: {
      padding: "1rem 1.5rem",
      fontSize: 16
    }
  };
  const variants = {
    primary: {
      background: "var(--action-primary)",
      borderColor: "var(--action-primary)",
      color: "var(--action-on-primary)"
    },
    secondary: {
      background: "transparent",
      borderColor: "var(--kom-charcoal)",
      color: "var(--kom-charcoal)"
    },
    ghost: {
      background: "transparent",
      borderColor: "transparent",
      color: "var(--kom-charcoal)"
    }
  };
  const style = {
    ...base,
    ...sizes[size],
    ...variants[variant]
  };
  const hoverStyle = variant === "primary" ? {
    background: "var(--action-primary-hover)",
    borderColor: "var(--action-primary-hover)"
  } : variant === "secondary" ? {
    background: "var(--kom-charcoal)",
    color: "var(--kom-white)"
  } : {
    background: "var(--kom-concrete)"
  };
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const activeStyle = variant === "primary" ? {
    background: "var(--action-primary-press)",
    borderColor: "var(--action-primary-press)"
  } : {};
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      ...style,
      ...(hover && !disabled ? hoverStyle : {}),
      ...(active && !disabled ? activeStyle : {}),
      transform: active && !disabled ? "scale(0.98)" : "scale(1)"
    }
  }, icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function Card({
  children,
  padded = true,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-card)",
      padding: padded ? "var(--space-6)" : 0,
      ...style
    }
  }, children);
}
function ServiceCard({
  title,
  description,
  icon,
  onClick
}) {
  return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: "var(--radius-sm)",
      background: "var(--surface-accent-soft)",
      color: "var(--kom-green-dark)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "var(--space-4)"
    }
  }, icon), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginBottom: "var(--space-2)"
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      marginBottom: "var(--space-4)"
    }
  }, description), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: onClick,
    style: {
      fontWeight: 700
    }
  }, "Learn more \u2192"));
}
Object.assign(__ds_scope, { Card, ServiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/forms/FormFields.jsx
try { (() => {
function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  name,
  required
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      fontFamily: "var(--font-main)"
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "var(--text-primary)"
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    type: type,
    name: name,
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    required: required,
    style: {
      fontFamily: "var(--font-main)",
      fontSize: 15,
      padding: "0.7rem 0.85rem",
      borderRadius: "var(--radius-sm)",
      border: "1px solid var(--border-default)",
      background: "var(--kom-white)",
      color: "var(--text-primary)",
      outline: "none"
    },
    onFocus: e => e.target.style.borderColor = "var(--border-focus)",
    onBlur: e => e.target.style.borderColor = "var(--border-default)"
  }));
}
function Select({
  label,
  options = [],
  value,
  onChange,
  name
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      fontFamily: "var(--font-main)"
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "var(--text-primary)"
    }
  }, label), /*#__PURE__*/React.createElement("select", {
    name: name,
    value: value,
    onChange: onChange,
    style: {
      fontFamily: "var(--font-main)",
      fontSize: 15,
      padding: "0.7rem 0.85rem",
      borderRadius: "var(--radius-sm)",
      border: "1px solid var(--border-default)",
      background: "var(--kom-white)",
      color: "var(--text-primary)"
    }
  }, options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o))));
}
const FormFields = {
  Input: null,
  Select: null,
  Checkbox: null
}; // marker export; use the named exports below directly

function Checkbox({
  label,
  checked,
  onChange,
  name
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "var(--font-main)",
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: name,
    checked: checked,
    onChange: onChange,
    style: {
      accentColor: "var(--action-primary)",
      width: 16,
      height: 16
    }
  }), label);
}
Object.assign(__ds_scope, { Input, Select, FormFields, Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/FormFields.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteChrome.jsx
try { (() => {
function NavBar({
  logo,
  links = [],
  cta
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px var(--container-pad)",
      background: "var(--kom-white)",
      borderBottom: "1px solid var(--border-default)",
      fontFamily: "var(--font-main)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center"
    }
  }, logo), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 28
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      fontWeight: 700,
      fontSize: 15,
      color: "var(--text-primary)"
    }
  }, l))), cta);
}
const SiteChrome = {
  NavBar: null,
  Footer: null
}; // marker export; use the named exports below directly

function Footer({
  logo,
  columns = []
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--surface-inverse)",
      color: "var(--text-inverse)",
      fontFamily: "var(--font-main)",
      padding: "var(--space-16) var(--container-pad)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-16)",
      flexWrap: "wrap",
      maxWidth: "var(--container-max)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 220px"
    }
  }, logo), columns.map(col => /*#__PURE__*/React.createElement("div", {
    key: col.title,
    style: {
      flex: "1 1 160px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      marginBottom: 12,
      fontSize: 14
    }
  }, col.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, col.items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it,
    href: "#",
    style: {
      color: "rgba(255,255,255,0.75)",
      fontSize: 14
    }
  }, it)))))));
}
Object.assign(__ds_scope, { NavBar, SiteChrome, Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteChrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/AboutPage.jsx
try { (() => {
function AboutPage({
  nav
}) {
  const {
    NavBar,
    Footer,
    Button,
    Badge
  } = window.KOMUSADesignSystem_8f04d7;
  const {
    Logo,
    Photo
  } = window.__komSite;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    logo: /*#__PURE__*/React.createElement(Logo, null),
    links: ["Services", "About", "Contact"],
    cta: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: () => nav("contact")
    }, "Get a Free Estimate")
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "var(--space-20) var(--container-pad)",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-16)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    tone: "green"
  }, "Family-owned since 2003"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 40,
      margin: "var(--space-4) 0"
    }
  }, "A hometown crew, not a franchise."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      lineHeight: 1.6,
      color: "var(--text-secondary)"
    }
  }, "KOM USA started with one truck and a handshake. Today we're still locally owned and operated \u2014 every estimate, every crew, every callback comes from people who live in this community too.")), /*#__PURE__*/React.createElement(Photo, {
    label: "The KOM USA crew",
    height: 340,
    tone: "green"
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-accent-soft)",
      padding: "var(--space-20) var(--container-pad)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-10)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      fontWeight: 800,
      color: "var(--kom-green-dark)"
    }
  }, "20+"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--text-secondary)"
    }
  }, "Years in business")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      fontWeight: 800,
      color: "var(--kom-green-dark)"
    }
  }, "500+"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--text-secondary)"
    }
  }, "Projects completed")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      fontWeight: 800,
      color: "var(--kom-green-dark)"
    }
  }, "4.9\u2605"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--text-secondary)"
    }
  }, "Average customer rating")))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "var(--space-20) var(--container-pad)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      marginBottom: "var(--space-8)"
    }
  }, "Our values"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-8)"
    }
  }, [["Show up on time", "We respect your schedule as much as our own."], ["Do the job right", "No shortcuts — we stand behind every project we finish."], ["Keep it honest", "Clear pricing and straight answers, no surprises."]].map(([t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      marginBottom: 8
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)"
    }
  }, d))))), /*#__PURE__*/React.createElement(Footer, {
    logo: /*#__PURE__*/React.createElement(Logo, {
      variant: "white",
      height: 30
    }),
    columns: [{
      title: "Services",
      items: ["Roofing", "Remodeling", "Repairs"]
    }, {
      title: "Company",
      items: ["About", "Careers", "Contact"]
    }]
  }));
}
Object.assign(__ds_scope, { AboutPage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/AboutPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ContactPage.jsx
try { (() => {
function ContactPage({
  nav
}) {
  const {
    NavBar,
    Footer,
    Button,
    Input,
    Select,
    Checkbox,
    Card
  } = window.KOMUSADesignSystem_8f04d7;
  const {
    Logo
  } = window.__komSite;
  const [submitted, setSubmitted] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    logo: /*#__PURE__*/React.createElement(Logo, null),
    links: ["Services", "About", "Contact"],
    cta: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: () => nav("contact")
    }, "Get a Free Estimate")
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 720,
      margin: "0 auto",
      padding: "var(--space-20) var(--container-pad) var(--space-24)"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 40,
      marginBottom: "var(--space-3)"
    }
  }, "Get a free estimate"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      color: "var(--text-secondary)",
      marginBottom: "var(--space-8)"
    }
  }, "Tell us a bit about your project and a local KOM USA team member will call you back within one business day."), /*#__PURE__*/React.createElement(Card, null, submitted ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "var(--space-10) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      marginBottom: 8
    }
  }, "\u2713"), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginBottom: 8
    }
  }, "Thanks \u2014 we'll be in touch soon."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)"
    }
  }, "A KOM USA team member will call within one business day.")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSubmitted(true);
    },
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Full name",
    placeholder: "Jane Homeowner",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Phone",
    type: "tel",
    placeholder: "(555) 010-0199",
    required: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    type: "email",
    placeholder: "jane@email.com",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Service needed",
    options: ["Roofing", "Remodeling", "Repairs", "Other"]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "I'd like a callback instead of an email"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1",
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "lg"
  }, "Request My Free Estimate"))))), /*#__PURE__*/React.createElement(Footer, {
    logo: /*#__PURE__*/React.createElement(Logo, {
      variant: "white",
      height: 30
    }),
    columns: [{
      title: "Services",
      items: ["Roofing", "Remodeling", "Repairs"]
    }, {
      title: "Company",
      items: ["About", "Careers", "Contact"]
    }]
  }));
}
Object.assign(__ds_scope, { ContactPage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ContactPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomePage.jsx
try { (() => {
function HomePage({
  nav
}) {
  const {
    NavBar,
    Footer,
    Button,
    Badge,
    ServiceCard,
    Card
  } = window.KOMUSADesignSystem_8f04d7;
  const {
    Logo
  } = window.__komSite;
  const {
    Photo
  } = window.__komSite;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    logo: /*#__PURE__*/React.createElement(Logo, null),
    links: ["Services", "About", "Contact"],
    cta: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: () => nav("contact")
    }, "Get a Free Estimate")
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "var(--space-24) var(--container-pad)",
      display: "grid",
      gridTemplateColumns: "1.1fr 1fr",
      gap: "var(--space-16)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    tone: "green"
  }, "Licensed & Insured \xB7 Serving the tri-county area"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 52,
      fontWeight: 800,
      lineHeight: 1.08,
      margin: "var(--space-4) 0 var(--space-4)"
    }
  }, "Local craftsmanship you can trust."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 20,
      lineHeight: 1.5,
      color: "var(--text-secondary)",
      marginBottom: "var(--space-6)"
    }
  }, "KOM USA has helped neighborhood homeowners with roofing, remodels, and repairs for over two decades. We show up on time and stand behind every job."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => nav("contact")
  }, "Get a Free Estimate"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    onClick: () => nav("services")
  }, "See Our Services"))), /*#__PURE__*/React.createElement(Photo, {
    label: "Finished roofing project",
    height: 380
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-accent-soft)",
      padding: "var(--space-8) var(--container-pad)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-around",
      flexWrap: "wrap",
      gap: 16,
      fontFamily: "var(--font-main)",
      fontWeight: 700,
      color: "var(--kom-green-dark)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "20+ Years Local"), /*#__PURE__*/React.createElement("span", null, "Licensed & Insured"), /*#__PURE__*/React.createElement("span", null, "500+ Projects Completed"), /*#__PURE__*/React.createElement("span", null, "Free On-Site Estimates"))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "var(--space-24) var(--container-pad)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      marginBottom: "var(--space-2)"
    }
  }, "Our services"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 17,
      marginBottom: "var(--space-10)"
    }
  }, "Practical work, done right the first time."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(ServiceCard, {
    title: "Roofing",
    description: "Repairs, replacements, and inspections built to last through every season.",
    icon: "\uD83C\uDFE0",
    onClick: e => {
      e.preventDefault();
      nav("services");
    }
  }), /*#__PURE__*/React.createElement(ServiceCard, {
    title: "Remodeling",
    description: "Kitchens, baths, and additions planned around how your family actually lives.",
    icon: "\uD83D\uDEE0\uFE0F",
    onClick: e => {
      e.preventDefault();
      nav("services");
    }
  }), /*#__PURE__*/React.createElement(ServiceCard, {
    title: "Repairs",
    description: "Fast, honest fixes for the everyday things that need a trusted local hand.",
    icon: "\uD83D\uDD27",
    onClick: e => {
      e.preventDefault();
      nav("services");
    }
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-inverse)",
      color: "var(--text-inverse)",
      padding: "var(--space-20) var(--container-pad)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: "0 auto",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 26,
      lineHeight: 1.4,
      fontWeight: 700,
      marginBottom: "var(--space-4)"
    }
  }, "\"KOM USA replaced our roof in two days and left the yard cleaner than they found it. Real hometown service.\""), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "rgba(255,255,255,0.7)",
      fontSize: 15
    }
  }, "\u2014 Marcy T., homeowner since 2019"))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "var(--space-20) var(--container-pad)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      marginBottom: 6
    }
  }, "Ready to get started?"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)"
    }
  }, "Estimates are free, and there's never any pressure.")), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => nav("contact")
  }, "Request a Free Estimate")), /*#__PURE__*/React.createElement(Footer, {
    logo: /*#__PURE__*/React.createElement(Logo, {
      variant: "white",
      height: 30
    }),
    columns: [{
      title: "Services",
      items: ["Roofing", "Remodeling", "Repairs"]
    }, {
      title: "Company",
      items: ["About", "Careers", "Contact"]
    }]
  }));
}
Object.assign(__ds_scope, { HomePage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomePage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Logo.jsx
try { (() => {
function Logo({
  variant = "charcoal",
  height = 34
}) {
  const srcs = {
    charcoal: "../../assets/logos/kom-usa-logo-primary-charcoal.svg",
    green: "../../assets/logos/kom-usa-logo-primary-green.svg",
    white: "../../assets/logos/kom-usa-logo-white.svg"
  };
  return /*#__PURE__*/React.createElement("img", {
    src: srcs[variant],
    alt: "KOM USA",
    style: {
      height
    }
  });
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Logo.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Photo.jsx
try { (() => {
function Photo({
  label,
  height = 320,
  tone = "green"
}) {
  const tones = {
    green: "linear-gradient(135deg, rgba(120,168,102,0.35), rgba(47,107,59,0.55))",
    steel: "linear-gradient(135deg, rgba(94,116,128,0.35), rgba(51,56,62,0.55))",
    charcoal: "linear-gradient(135deg, rgba(51,56,62,0.5), rgba(51,56,62,0.75))"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      width: "100%",
      borderRadius: "var(--radius-md)",
      background: tones[tone],
      display: "flex",
      alignItems: "flex-end",
      padding: 16,
      color: "#fff",
      fontFamily: "var(--font-main)",
      fontSize: 13,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.9
    }
  }, "\uD83D\uDCF7 ", label, " \u2014 real project photo goes here"));
}
Object.assign(__ds_scope, { Photo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Photo.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ServicesPage.jsx
try { (() => {
const SERVICES = [{
  title: "Roofing",
  icon: "🏠",
  description: "Inspections, repairs, and full replacements using durable, weather-ready materials.",
  items: ["Roof repair & patching", "Full roof replacement", "Storm damage inspection", "Gutter & flashing work"]
}, {
  title: "Remodeling",
  icon: "🛠️",
  description: "Kitchens, bathrooms, and additions planned around how your family lives.",
  items: ["Kitchen remodels", "Bathroom remodels", "Room additions", "Basement finishing"]
}, {
  title: "Repairs",
  icon: "🔧",
  description: "Fast, honest fixes for the everyday things that need a trusted local hand.",
  items: ["Siding & trim repair", "Drywall & paint touch-ups", "Deck & fence repair", "General handyman work"]
}];
function ServicesPage({
  nav
}) {
  const {
    NavBar,
    Footer,
    Button,
    Card
  } = window.KOMUSADesignSystem_8f04d7;
  const {
    Logo,
    Photo
  } = window.__komSite;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    logo: /*#__PURE__*/React.createElement(Logo, null),
    links: ["Services", "About", "Contact"],
    cta: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: () => nav("contact")
    }, "Get a Free Estimate")
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "var(--space-20) var(--container-pad) var(--space-10)"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 40,
      marginBottom: "var(--space-3)"
    }
  }, "Our services"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      color: "var(--text-secondary)",
      maxWidth: 640
    }
  }, "From a single repair to a full remodel, our crews are local, licensed, and insured \u2014 and every estimate is free.")), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "0 var(--container-pad) var(--space-24)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-16)"
    }
  }, SERVICES.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.title,
    style: {
      display: "grid",
      gridTemplateColumns: i % 2 === 0 ? "1fr 1fr" : "1fr 1fr",
      gap: "var(--space-10)",
      alignItems: "center"
    }
  }, i % 2 === 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Photo, {
    label: `${s.title} in progress`,
    height: 280,
    tone: i === 0 ? "green" : i === 1 ? "steel" : "charcoal"
  }), /*#__PURE__*/React.createElement(ServiceDetail, {
    s: s,
    nav: nav
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ServiceDetail, {
    s: s,
    nav: nav
  }), /*#__PURE__*/React.createElement(Photo, {
    label: `${s.title} in progress`,
    height: 280,
    tone: "steel"
  }))))), /*#__PURE__*/React.createElement(Footer, {
    logo: /*#__PURE__*/React.createElement(Logo, {
      variant: "white",
      height: 30
    }),
    columns: [{
      title: "Services",
      items: ["Roofing", "Remodeling", "Repairs"]
    }, {
      title: "Company",
      items: ["About", "Careers", "Contact"]
    }]
  }));
}
function ServiceDetail({
  s,
  nav
}) {
  const {
    Button
  } = window.KOMUSADesignSystem_8f04d7;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      marginBottom: 8
    }
  }, s.icon), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginBottom: "var(--space-2)"
    }
  }, s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      marginBottom: "var(--space-4)"
    }
  }, s.description), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: "none",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      marginBottom: "var(--space-6)"
    }
  }, s.items.map(it => /*#__PURE__*/React.createElement("li", {
    key: it,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--kom-green-dark)",
      fontWeight: 700
    }
  }, "\u2713"), " ", it))), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => nav("contact")
  }, "Request an estimate"));
}
Object.assign(__ds_scope, { ServicesPage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ServicesPage.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.ServiceCard = __ds_scope.ServiceCard;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.FormFields = __ds_scope.FormFields;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.SiteChrome = __ds_scope.SiteChrome;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.AboutPage = __ds_scope.AboutPage;

__ds_ns.ContactPage = __ds_scope.ContactPage;

__ds_ns.HomePage = __ds_scope.HomePage;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Photo = __ds_scope.Photo;

__ds_ns.ServicesPage = __ds_scope.ServicesPage;

})();
