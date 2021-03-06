// Copyright 2018 Tristan Robert

// This file is part of ForemanFogProxmox.

// ForemanFogProxmox is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ForemanFogProxmox is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ForemanFogProxmox. If not, see <http://www.gnu.org/licenses/>.

function cdromSelected(item) {
  var selected = $(item).val();
  var cdrom_image_form = $('#cdrom_image_form');

  switch (selected) {
    case 'none':
      initCdromStorage();
      initCdromOptions('iso');
      cdrom_image_form.hide();
      break;
    case 'cdrom':
      initCdromStorage();
      initCdromOptions('iso');
      cdrom_image_form.hide();
      break;
    case 'image':
      initCdromStorage();
      initCdromOptions('iso');
      cdrom_image_form.show();
      break;
    default:
      break;
  }
  return false;
}

function initCdromStorage() {
  var select = '#host_compute_attributes_config_attributes_cdrom_storage';
  $(select + ' option:selected').prop('selected', false);
  $(select).val('');
}

function initCdromOptions(name) {
  var select = '#host_compute_attributes_config_attributes_cdrom_' + name;
  $(select).empty();
  $(select).append($("<option></option>").val('').text(''));
  $(select).val('');
}

function storageIsoSelected(item) {
  var storage = $(item).val();
  var node_id = $('#host_compute_attributes_node_id').val();
  updateOptions('isos', 'compute_attributes_config_attributes', 'cdrom_iso', undefined, undefined, 'volid', node_id, storage);
}

function attributesPrefixSelector(profile, type) {
  return profile ?  '#compute_attribute_vm_attrs_' + type + '_attributes_': '#host_compute_attributes_' + type + '_attributes_';
}

function volumesAttributesSelector(profile,index,selector) {
  return attributesPrefixSelector(profile,'volumes') + index + '_' + selector;
}

function getIndex(item) {
  var id = $(item).attr('id');
  var pattern = /(host_compute_attributes_volumes_attributes_||compute_attribute_vm_attrs_volumes_attributes_)(\d+)[_](.*)/i;
  pattern_a = pattern.exec(id);
  var index = pattern_a[2];
  console.log("index=" + index);
  return index;
}

function isProfile() {
  return $(volumesAttributesSelector(true,0,'id')) !== undefined;
}

function controllerSelected(item) {
  var controller = $(item).val();
  var index = getIndex(item);
  var max = computeControllerMaxDevice(controller);
  var profile = isProfile();
  console.log("profile="+profile);
  var device_selector = volumesAttributesSelector(profile,index,'device');
  var id_selector = volumesAttributesSelector(profile,index,'id');
  $(device_selector).attr('data-soft-max', max);
  var device = $(device_selector).limitedSpinner('value');
  var id = controller + device;
  $(id_selector).val(id);
  tfm.numFields.initAll();
}

function deviceSelected(item) {
  var device = $(item).limitedSpinner('value');
  var index = getIndex(item);
  var profile = isProfile();
  console.log("profile="+profile);
  var controller_selector = volumesAttributesSelector(profile,index,'controller');
  var id_selector = volumesAttributesSelector(profile,index,'id');
  var controller = $(controller_selector).val();
  var id = controller + device;
  $(id_selector).val(id);
  tfm.numFields.initAll();
}

function computeControllerMaxDevice(controller) {
  switch (controller) {
    case 'ide':
      return 3;
    case 'sata':
      return 5;
    case 'scsi':
      return 13;
    case 'virtio':
      return 15;
    default:
      return 1;
  }
}