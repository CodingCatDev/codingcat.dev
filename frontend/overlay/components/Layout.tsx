import { FirebaseFirestoreProvider, FirebaseProvider } from './wrappers';

const Layout = ({ children }: any) => {
	return (
		<>
			<FirebaseProvider>
				<FirebaseFirestoreProvider>
					<>{children}</>
				</FirebaseFirestoreProvider>
			</FirebaseProvider>
		</>
	);
};
export default Layout;
