import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import * as XLSX from 'xlsx';
import 'leaflet/dist/leaflet.css';

// You'll need to import a marker icon image
import markerIcon from '../assets/marker-icon.png';

const customMarkerIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const Reports = ({ projects, activities, beneficiaries, locations }) => {
  const [selectedProject, setSelectedProject] = useState('');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-12-31');
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (selectedProject) {
      generateReportData();
    }
  }, [selectedProject, startDate, endDate]);

  const generateReportData = () => {
    if (!selectedProject || !projects[selectedProject]) return;

    const projectData = projects[selectedProject];
    
    // Generate beneficiary reach and services data
    const reachAndServicesData = projectData.reduce((acc, indicator) => {
      const indicatorActivities = activities.filter(activity => 
        indicator.linkedActivities.includes(activity.activityType) &&
        new Date(activity.date) >= new Date(startDate) &&
        new Date(activity.date) <= new Date(endDate)
      );

      indicatorActivities.forEach(activity => {
        const month = activity.date.slice(0, 7); // YYYY-MM
        if (!acc[month]) {
          acc[month] = { month, beneficiaries: new Set(), services: 0 };
        }
        acc[month].beneficiaries.add(activity.beneficiaryId);
        acc[month].services++;
      });

      return acc;
    }, {});

    const reachAndServicesChartData = Object.values(reachAndServicesData).map(data => ({
      month: data.month,
      beneficiaries: data.beneficiaries.size,
      services: data.services
    })).sort((a, b) => a.month.localeCompare(b.month));

    // Generate indicator progress data
    const indicatorProgress = projectData.map(indicator => {
      const indicatorActivities = activities.filter(activity => 
        indicator.linkedActivities.includes(activity.activityType) &&
        new Date(activity.date) >= new Date(startDate) &&
        new Date(activity.date) <= new Date(endDate)
      );

      const uniqueBeneficiaries = new Set(indicatorActivities.map(a => a.beneficiaryId));
      const uniqueBeneficiaryDetails = Array.from(uniqueBeneficiaries).map(id => 
        beneficiaries.find(b => b.id === id)
      );

      return {
        indicator