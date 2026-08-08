type ButtonProps = React.ComponentProps<"button">;

export default function HeaderButton({ ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className="App-header-button"
      {...props}
    />
  );
}
