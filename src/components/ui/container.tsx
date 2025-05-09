

interface IContainer {
    children: React.ReactNode
}
const Container = (props: IContainer) => {
    const { children } = props;
    return <div className="container mx-auto p-2">{children}</div>;
};

export default Container;