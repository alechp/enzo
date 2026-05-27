import { type ParentProps } from 'solid-js';
import Nav from './Nav';
import Footer from './Footer';
import AccessGate from './AccessGate';

export default function Shell(props: ParentProps) {
  return (
    <AccessGate>
      <div class="max-w-[1280px] mx-auto px-7">
        <Nav />
        {props.children}
        <Footer />
      </div>
    </AccessGate>
  );
}
