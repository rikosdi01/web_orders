import './Order.css'
import ActionButton from "../../../components/button/ActionButton/ActionButton";
import Search from "../../../components/search/Search";
import { FilePlus2 } from 'lucide-react';
import TableOrder from './components/TableOrder';
import { useToast } from '../../../context/ToastContext';

const Order = () => {
  const { showToast } = useToast();

  const handleOrderAdd = () => {
    window.open("/order/create", "_blank");
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <div className="order-action">
        <Search placeholder="Cari Orderan..." />
        <ActionButton title="Baru" icon={<FilePlus2 size={18} />} onclick={handleOrderAdd}/>
      </div>

      <TableOrder />
    </div>
  );
};

export default Order