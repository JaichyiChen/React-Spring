import { Carousel } from "./Components/Carousel"
import { ExploreTopBooks } from "./Components/ExploreTopBooks"
import { Heroes } from "./Components/Heroes"
import { LibraryServices } from "./Components/LibraryServices"


export const HomePage = () => {
    return (
        <div>
            <ExploreTopBooks></ExploreTopBooks>
            <Carousel></Carousel>
            <Heroes></Heroes>
            <LibraryServices></LibraryServices>
        </div>
    )
}