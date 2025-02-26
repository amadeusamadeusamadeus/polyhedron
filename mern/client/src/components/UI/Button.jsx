export default function Button({ children, textOnly, className, ...props }) {
    const cssClasses = [textOnly ? "text-button" : "button", className]
        .filter(Boolean)
        .join(" ");
    return <button className={cssClasses} {...props}>{children}</button>;
}