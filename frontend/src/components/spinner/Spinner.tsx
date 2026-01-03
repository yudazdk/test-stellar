import './spinner.css';

interface IProps {
  size?: number;
}

/**
 *
 * @param props
 * @returns
 */
export default function Spinner(props: IProps) {
  const { size } = props;

  const width = `${size || 40}px`;
  const height = width;

  return <div className="spinner" style={{ width, height }} />;
}
