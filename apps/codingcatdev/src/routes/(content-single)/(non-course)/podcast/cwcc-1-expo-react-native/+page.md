---
type: podcast
authors:
  - alex-patterson
episode:
recording_date: Dec 18, 2023 12:00 PM
season: 3
published: published
podcast: code-with-coding-cat
chapters_done: false
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1703611617/main-codingcatdev-photo/3_ReactNativeExpo.png
devto:
excerpt: 'Dive into the seamless world of cross-platform app development as we unravel the magic of React Native with Expo, combining power and simplicity for an unparalleled mobile experience.'
guests:
  - simon-grimm
hashnode:
picks:
slug: cwcc-1-expo-react-native
sponsors:
spotify:
start: Dec 18, 2023
title: 'Exploring React Native: A Journey into Cross-Platform Delight'
youtube: https://youtube.com/live/xtj5wPgWuf4?feature=share
---

<script>
  import OpenIn from '$lib/components/content/OpenIn.svelte'
</script>

<OpenIn url="https://github.com/CodingCatDev/cwcc-expo-react-native-catapp"  />

## Introduction

Welcome to a live coding session where we build a [React Native](https://reactnative.dev/) mobile app from scratch using [Expo](https://expo.dev/)! My name is Alex and I'm joined by special guest [Simon Grimm](/guest/simon-grimm), an expert in React Native and mobile development.

In this extensive blog post, we will:

- Set up a React Native development environment with Expo
- Create UI components like buttons, images, links, scroll views etc.
- Implement routing and navigation between screens
- Fetch data and display it in the UI
- Open the camera and image library to select photos
- Deploy the app to mobile devices using Expo Go

So let's get started!

## Full Solution

## Setting up the Development Environment

First, we need to set up a React Native environment on our machines using Expo.

```bash
npx create-expo-app cat-app
```

This scaffolds a new React Native project for us called `cat-app`.

Inside the project, we have an `App.js` file along with other config files. This `App.js` renders the entry component for our app.

We can now start the Expo development server:

```bash
npx expo start
```

And voila! The app opens up in the iOS Simulator. Later, we'll also install the [Expo Go](https://expo.dev/client) app on an actual mobile device.

![App Screenshot](https://media.codingcat.dev/image/upload/h_600/v1703613845/main-codingcatdev-photo/Screenshot_2023-12-26_at_1.03.56_PM.png)

## Creating the Home Screen

Let's start building out the Home screen:

### Displaying the Cat Images

We want to fetch some cat images from an API and display them on the Home screen.

First, we fetch the cat images:

```tsx
const fetchCats = async () => {
	const res = await fetch('https://cataas.com/cat?json=true');
	return res.json();
};
```

Then we store them in React state and display them in a ScrollView:

```tsx
const index = () => {
	const [cats, setCats] = useState<Cat[]>([]);
	useEffect(() => {
		loadCats();
	}, []);

	const loadCats = async () => {
		const data = await fetch('https://api.thecatapi.com/v1/images/search?limit=10');
		const cats: Cat[] = await data.json();
		setCats(cats);
	};
	return (
		<ScrollView contentContainerStyle={{ marginBottom: 10 }}>
			{cats.map((cat) => (
				<Link href={`/${cat.id}`} asChild key={cat.id}>
					<TouchableHighlight style={styles.item}>
						<Image source={{ uri: cat.url }} style={{ width: '100%', height: 300 }} />
					</TouchableHighlight>
				</Link>
			))}
		</ScrollView>
	);
};
```

This will display the cat images in a nice scrollable view.

We also added a "Load Cats" button to trigger fetching images:

```tsx
<Button title="Load Cats" onPress={loadCats} />
```

### Adding Navigation Between Screens

We want to navigate to a Details screen when a cat image is tapped.

[Expo Router](https://docs.expo.dev/router/introduction/) makes navigation really easy. We simply wrap the `Image` component in a `Link` to link to the Details screen:

```js
{cats.map(cat => (<Link href={`/details/${cat.id}`}><Imagekey={cat.id}source={{uri: cat.url}}style={{width: 100, height: 100}}/></Link>))}
```

Then we create a `details.js` screen that loads the specific cat details:

```js
export default function Details() {
	const { id } = useParams();
	const [image, setImage] = useState();
	useEffect(() => {
		fetchCat(id).then(setImage);
	}, []);
	return <View>{image && <Image source={{ uri: image.url }} />}</View>;
}
```

When you tap a cat image now, it seamlessly navigates to the Details screen with the tapped cat image loaded!

## Opening the Camera with Expo

Finally, let's allow users to take or select photos using the camera. Expo makes accessing native device capabilities like camera super easy.

We just install the expo-image-picker package:

```sh
npx expo install expo-image-picker
```

And import it in our Modal screen:

```js
import * as ImagePicker from 'expo-image-picker';
export default function Modal() {
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync();
		if (!result.cancelled) {
			setImage(result.uri);
		}
	};
	return <Button title="Pick an Image" onPress={pickImage} />;
}
```

That's it! We can now open up the phone's image library, select images and handle them in our React Native code.

## Conclusion

In this post, we:

- Created a React Native app with Expo CLI
- Built out Home, Details and Modal screens
- Added routing and navigation with Expo Router
- Fetched and displayed data from an API
- Opened up the camera picker using Expo APIs

As you can see, Expo simplifies React Native development tremendously allowing us to focus on the app code rather than native platform intricacies.

I hope you enjoyed this post and got an idea of building mobile apps with React Native and Expo! Let me know in [Discord](https://discord.com/invite/fRJTRjR) if you have any other questions.
