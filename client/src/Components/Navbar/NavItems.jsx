import { useSelector } from 'react-redux';
import styles from './Navbar.module.css';
import { jsPDF } from 'jspdf';
import { Rubik } from './../../fonts/Rubik';
import { NavHashLink } from 'react-router-hash-link';
import { Slide, IconButton, Tooltip } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';

export function IconWrapper({ children, glassMorph }) {
  return (
    <Slide in={true} direction={'left'} timeout={1200}>
      <div className={`${styles.icons} ${glassMorph && styles.glass}`}>{children}</div>
    </Slide>
  );
}

export function Icon({ link, title, icon, onClick }) {
  return (
    <NavHashLink smooth to={link ? link : ''}>
      <Tooltip position='bottom' title={title}>
        <IconButton onClick={onClick}>{icon}</IconButton>
      </Tooltip>
    </NavHashLink>
  );
}

export function DownloadIcon() {
  const { history } = useSelector((state) => state.roomReducer);

  const downloadPDF = () => {
    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jsPDF();
    // break-down history data to printable array indexes
    let historyData = [];
    for (let i = 0; i < history.length; i++) {
      historyData.unshift('');
      historyData.unshift(`At: ${new Date(history[i].updatedAt).toTimeString()}`);
      historyData.unshift(`Answer: ${history[i].answer}`);
      historyData.unshift(`Question: ${history[i].question}`);
    }
    // define PDF rules
    const printData = doc.splitTextToSize(historyData, 250);
    doc.addFileToVFS('Rubik.ttf', Rubik);
    doc.addFont('Rubik.ttf', 'Rubik', 'normal');
    doc.setFont('Rubik');
    doc.setFontSize(12);
    // loop through printable-data and add new pages when required
    for (let index = 0, yAxis = 15, xAxis = 10; index < printData.length; index++) {
      if (yAxis > 280) {
        yAxis = 10;
        doc.addPage();
      }
      doc.text(printData[index], xAxis, yAxis);
      yAxis += 7;
    }
    // download the file
    doc.save(`Queue ${new Date()}.pdf`);
  };

  return <Icon onClick={downloadPDF} icon={<GetAppIcon />} title='Download History' />;
}
