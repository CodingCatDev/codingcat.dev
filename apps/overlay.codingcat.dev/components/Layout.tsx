import Overlays from './Overlays';
import { FirebaseFirestoreProvider, FirebaseProvider } from './wrappers';

const Layout = ({ children }: any) => {
	return (
		<>
			<FirebaseProvider>
				<FirebaseFirestoreProvider>
					<>
						{children}
						<Overlays />
					</>
				</FirebaseFirestoreProvider>
			</FirebaseProvider>
		</>
	);
};
export default Layout;
