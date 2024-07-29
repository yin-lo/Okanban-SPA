import Sortable from 'sortablejs';

var el = document.getElementById('list1');
var sortable = Sortable.create(el, {
  group: 'shared',
  onEnd: function (/**Event*/ evt) {
    evt.oldIndex;
    evt.newIndex;
    console.log(evt.from, evt.to);
  },
});

var el2 = document.getElementById('list2');
var sortable = Sortable.create(el2, {
  group: 'shared',
  onEnd: function (/**Event*/ evt) {
    evt.oldIndex;
    evt.newIndex;
    console.log(evt.oldIndex, evt.newIndex);
  },
});
