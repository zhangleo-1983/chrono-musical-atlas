import MapView from './map/MapView';
import TopBar from './ui/TopBar';
import Timeline from './ui/Timeline';
import NodeDrawer from './ui/NodeDrawer';
import CompareDock from './ui/CompareDock';
import CompareModal from './ui/CompareModal';
import OdysseyBar from './ui/OdysseyBar';

export default function App() {
  return <main><MapView /><TopBar /><OdysseyBar /><Timeline /><CompareDock /><NodeDrawer /><CompareModal /></main>;
}
